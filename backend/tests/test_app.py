from __future__ import annotations

import tempfile
from pathlib import Path
import unittest

from fastapi.testclient import TestClient

from app.core.taxonomy import EducationLevel, MaterialType, Role
from app.db import configure_engine, dispose_engine, get_db, get_session_factory, init_db
from app.main import create_app
from app.models.material import Material
from app.models.user import User


class BackendSmokeTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test.db"
        self.database_url = f"sqlite:///{self.db_path.as_posix()}"
        self.app = create_app(database_url=self.database_url)
        configure_engine(self.database_url)
        init_db()

        session_factory = get_session_factory()

        def override_db():
            session = session_factory()
            try:
                yield session
            finally:
                session.close()

        self.app.dependency_overrides[get_db] = override_db
        self.client = TestClient(self.app)

    def tearDown(self) -> None:
        self.client.close()
        self.app.dependency_overrides.clear()
        dispose_engine()
        self.temp_dir.cleanup()

    def _create_user(self, username: str, role: Role = Role.STUDENT) -> User:
        session_factory = get_session_factory()
        with session_factory() as session:
            user = User(
                username=username,
                email=f"{username}@example.com",
                password_hash="pbkdf2_sha256$210000$c2FsdHNhbHQ$c2FsdGVkaGFzaA",
                role=role.value,
                full_name="Test User",
                school_name="Sample School",
                education_level=EducationLevel.SENIOR.value,
                school_class="Form 4",
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            return user

    def test_health_endpoint(self) -> None:
        response = self.client.get("/api/v1/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_register_login_and_protected_download(self) -> None:
        register = self.client.post(
            "/api/v1/auth/register",
            json={
                "username": "student1",
                "email": "student1@example.com",
                "password": "StrongPass123",
                "full_name": "Student One",
                "education_level": "senior",
                "school_class": "Form 4",
                "school_name": "Kasungu Secondary",
                "district": "Kasungu",
            },
        )
        self.assertEqual(register.status_code, 200, register.text)
        token = register.json()["access_token"]

        login = self.client.post(
            "/api/v1/auth/login",
            json={"identifier": "student1", "password": "StrongPass123"},
        )
        self.assertEqual(login.status_code, 200, login.text)
        self.assertIn("access_token", login.json())

        admin = self._create_user("admin1", role=Role.ADMIN)
        with get_session_factory()() as session:
            material = Material(
                title="Mathematics Paper 1",
                author="MANEB",
                material_type=MaterialType.PAST_PAPER.value,
                education_level=EducationLevel.SENIOR.value,
                school_class="Form 4",
                subject="Mathematics",
                school_name="MANEB",
                year=2024,
                file_name="math-paper-1.pdf",
                storage_key="past_paper/math-paper-1.pdf",
                storage_url="https://mega.example/download/math-paper-1.pdf",
                dedupe_key="mathematics paper 1|past paper",
                uploaded_by_id=admin.id,
            )
            session.add(material)
            session.commit()
            session.refresh(material)
            material_id = material.id

        download = self.client.post(
            f"/api/v1/materials/{material_id}/download",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(download.status_code, 200, download.text)
        self.assertEqual(download.json()["download_url"], "https://mega.example/download/math-paper-1.pdf")


if __name__ == "__main__":
    unittest.main()



