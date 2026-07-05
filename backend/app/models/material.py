from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.download_log import DownloadLog
    from app.models.user import User


class Material(Base, TimestampMixin):
    __tablename__ = "materials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    author: Mapped[str | None] = mapped_column(String(255), nullable=True)
    material_type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    education_level: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    school_class: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    school_name: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    seniority: Mapped[str | None] = mapped_column(String(20), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size_bytes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    mime_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    storage_provider: Mapped[str] = mapped_column(String(32), default="mega", nullable=False)
    storage_key: Mapped[str] = mapped_column(String(500), unique=True, nullable=False, index=True)
    storage_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    dedupe_key: Mapped[str] = mapped_column(String(600), unique=True, nullable=False, index=True)
    download_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_downloaded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    uploaded_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)

    uploaded_by: Mapped["User"] = relationship(back_populates="materials_uploaded")
    download_logs: Mapped[list["DownloadLog"]] = relationship(back_populates="material")

    __table_args__ = (
        Index("ix_materials_lookup", "education_level", "school_class", "subject", "material_type"),
        Index("ix_materials_search", "title", "subject", "school_name"),
    )

