from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.core.taxonomy import EducationLevel, MaterialType, build_dedupe_key, is_allowed_class, is_allowed_subject
from app.models.download_log import DownloadLog
from app.models.material import Material
from app.models.user import User
from app.schemas.materials import MaterialCreate, MaterialFilters, MaterialUpdate
from app.services.storage_service import storage_service


class MaterialService:
    def _build_dedupe_key(self, payload: MaterialCreate) -> str:
        return build_dedupe_key(
            payload.title,
            payload.material_type.value,
            payload.education_level.value,
            payload.school_class,
            payload.subject,
            str(payload.year or ""),
            payload.school_name or "",
            payload.author or "",
        )

    def _validate_taxonomy(self, payload: MaterialCreate | MaterialUpdate) -> None:
        level = payload.education_level
        school_class = payload.school_class
        subject = payload.subject
        if level and school_class and not is_allowed_class(level, school_class):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Class does not match education level")
        if level and subject and not is_allowed_subject(level, subject):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Subject is not allowed for this education level")

    def create_material(self, session: Session, payload: MaterialCreate) -> Material:
        self._validate_taxonomy(payload)
        dedupe_key = self._build_dedupe_key(payload)
        if session.scalars(select(Material).where(Material.dedupe_key == dedupe_key)).first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate material already exists")

        storage_descriptor = storage_service.resolve_download_url(payload.storage_key, payload.storage_url)
        material = Material(
            title=payload.title,
            author=payload.author,
            material_type=payload.material_type.value,
            education_level=payload.education_level.value,
            school_class=payload.school_class,
            subject=payload.subject,
            school_name=payload.school_name,
            year=payload.year,
            seniority=payload.seniority,
            description=payload.description,
            file_name=payload.file_name,
            file_size_bytes=payload.file_size_bytes,
            mime_type=payload.mime_type,
            storage_provider="mega",
            storage_key=payload.storage_key,
            storage_url=storage_descriptor,
            cover_image_url=payload.cover_image_url,
            dedupe_key=dedupe_key,
            uploaded_by_id=payload.uploaded_by_id,
        )
        session.add(material)
        session.commit()
        session.refresh(material)
        return material

    def list_materials(self, session: Session, filters: MaterialFilters) -> tuple[list[Material], int]:
        stmt = select(Material).options(selectinload(Material.uploaded_by))
        count_stmt = select(func.count()).select_from(Material)

        clauses = []
        if filters.query:
            query = f"%{filters.query.strip()}%"
            clauses.append(
                or_(
                    Material.title.ilike(query),
                    Material.author.ilike(query),
                    Material.subject.ilike(query),
                    Material.school_name.ilike(query),
                )
            )
        if filters.education_level:
            clauses.append(Material.education_level == filters.education_level.value)
        if filters.school_class:
            clauses.append(Material.school_class == filters.school_class)
        if filters.subject:
            clauses.append(Material.subject == filters.subject)
        if filters.material_type:
            clauses.append(Material.material_type == filters.material_type.value)
        if filters.school_name:
            clauses.append(Material.school_name == filters.school_name)
        if filters.year:
            clauses.append(Material.year == filters.year)
        if filters.uploaded_by_id:
            clauses.append(Material.uploaded_by_id == filters.uploaded_by_id)

        for clause in clauses:
            stmt = stmt.where(clause)
            count_stmt = count_stmt.where(clause)

        items = session.scalars(stmt.order_by(Material.created_at.desc())).all()
        total = session.scalar(count_stmt) or 0
        return list(items), total

    def get_material(self, session: Session, material_id: int) -> Material:
        material = session.get(Material, material_id)
        if not material:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")
        return material

    def update_material(self, session: Session, material: Material, payload: MaterialUpdate) -> Material:
        data = payload.model_dump(exclude_unset=True)
        if any(key in data for key in {"education_level", "school_class", "subject"}):
            candidate = MaterialCreate(
                title=data.get("title", material.title),
                author=data.get("author", material.author),
                material_type=data.get("material_type", MaterialType(material.material_type)),
                education_level=data.get("education_level", EducationLevel(material.education_level)),
                school_class=data.get("school_class", material.school_class),
                subject=data.get("subject", material.subject),
                school_name=data.get("school_name", material.school_name),
                year=data.get("year", material.year),
                seniority=data.get("seniority", material.seniority),
                description=data.get("description", material.description),
                file_name=data.get("file_name", material.file_name),
                file_size_bytes=data.get("file_size_bytes", material.file_size_bytes),
                mime_type=data.get("mime_type", material.mime_type),
                storage_key=data.get("storage_key", material.storage_key),
                storage_url=data.get("storage_url", material.storage_url),
                cover_image_url=data.get("cover_image_url", material.cover_image_url),
                uploaded_by_id=material.uploaded_by_id,
            )
            self._validate_taxonomy(candidate)

        for field, value in data.items():
            if hasattr(value, "value"):
                value = value.value
            setattr(material, field, value)

        if any(key in data for key in {"title", "author", "material_type", "education_level", "school_class", "subject", "school_name", "year", "seniority"}):
            material.dedupe_key = build_dedupe_key(
                material.title,
                material.material_type,
                material.education_level,
                material.school_class,
                material.subject,
                str(material.year or ""),
                material.school_name or "",
                material.author or "",
            )

        session.add(material)
        session.commit()
        session.refresh(material)
        return material

    def delete_material(self, session: Session, material: Material) -> None:
        session.delete(material)
        session.commit()

    def register_download(
        self,
        session: Session,
        material: Material,
        user: User,
        *,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> str:
        download_url = storage_service.resolve_download_url(material.storage_key, material.storage_url)
        material.download_count += 1
        material.last_downloaded_at = datetime.now(timezone.utc)
        session.add(
            DownloadLog(
                user_id=user.id,
                material_id=material.id,
                ip_address=ip_address,
                user_agent=user_agent,
                delivery_url=download_url,
            )
        )
        session.add(material)
        session.commit()
        return download_url


material_service = MaterialService()

