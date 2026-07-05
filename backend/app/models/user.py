from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.taxonomy import EducationLevel, Gender, Role
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.download_log import DownloadLog
    from app.models.material import Material


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(32), unique=True, nullable=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(16), default=Role.STUDENT.value, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    district: Mapped[str | None] = mapped_column(String(120), nullable=True)
    school_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    education_level: Mapped[str | None] = mapped_column(String(20), nullable=True)
    school_class: Mapped[str | None] = mapped_column(String(30), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    materials_uploaded: Mapped[list["Material"]] = relationship(back_populates="uploaded_by")
    download_logs: Mapped[list["DownloadLog"]] = relationship(back_populates="user")

    __table_args__ = (
        Index("ix_users_role_level", "role", "education_level"),
    )

