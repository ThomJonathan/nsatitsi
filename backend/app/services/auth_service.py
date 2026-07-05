from __future__ import annotations

from dataclasses import asdict
from datetime import datetime, timezone
from typing import Iterable

from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.security import create_signed_token, hash_password, verify_password
from app.core.taxonomy import Role
from app.models.user import User
from app.schemas.auth import AuthTokenResponse, LoginRequest, RegisterRequest
from app.schemas.common import UserSummary
from app.schemas.users import UserProfileUpdate


class AuthService:
    def _to_summary(self, user: User) -> UserSummary:
        return UserSummary.model_validate(user)

    def _issue_token(self, user: User) -> str:
        payload = {
            "sub": str(user.id),
            "user_id": user.id,
            "role": user.role,
            "username": user.username,
            "exp": int(datetime.now(timezone.utc).timestamp()) + 60 * 60 * 24,
        }
        return create_signed_token(payload)

    def _find_user_by_identifier(self, session: Session, identifier: str) -> User | None:
        stmt = select(User).where(
            or_(
                User.username == identifier,
                User.email == identifier,
                User.phone == identifier,
            )
        )
        return session.scalars(stmt).first()

    def register(self, session: Session, payload: RegisterRequest) -> AuthTokenResponse:
        existing = self._find_user_by_identifier(session, payload.username)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")
        if payload.email and session.scalars(select(User).where(User.email == payload.email)).first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
        if payload.phone and session.scalars(select(User).where(User.phone == payload.phone)).first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone number already exists")

        user = User(
            username=payload.username,
            email=str(payload.email) if payload.email else None,
            phone=payload.phone,
            password_hash=hash_password(payload.password),
            role=payload.role.value,
            full_name=payload.full_name,
            gender=payload.gender.value if payload.gender else None,
            district=payload.district,
            school_name=payload.school_name,
            education_level=payload.education_level,
            school_class=payload.school_class,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return AuthTokenResponse(access_token=self._issue_token(user), user=self._to_summary(user))

    def login(self, session: Session, payload: LoginRequest) -> AuthTokenResponse:
        user = self._find_user_by_identifier(session, payload.identifier)
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")
        return AuthTokenResponse(access_token=self._issue_token(user), user=self._to_summary(user))

    def update_profile(self, session: Session, user: User, payload: UserProfileUpdate) -> User:
        data = payload.model_dump(exclude_unset=True)
        for field, value in data.items():
            if field == "gender" and value is not None:
                setattr(user, field, value.value if hasattr(value, "value") else value)
            else:
                setattr(user, field, value)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


auth_service = AuthService()

