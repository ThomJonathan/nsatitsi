from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.core.taxonomy import EducationLevel, MaterialType
from app.schemas.common import UserSummary


class MaterialBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    author: str | None = Field(default=None, max_length=255)
    material_type: MaterialType
    education_level: EducationLevel
    school_class: str = Field(min_length=1, max_length=30)
    subject: str = Field(min_length=1, max_length=120)
    school_name: str | None = Field(default=None, max_length=255)
    year: int | None = Field(default=None, ge=1900, le=2100)
    seniority: str | None = Field(default=None, max_length=20)
    description: str | None = None
    file_name: str = Field(min_length=1, max_length=255)
    file_size_bytes: int | None = Field(default=None, ge=0)
    mime_type: str | None = Field(default=None, max_length=120)
    storage_key: str = Field(min_length=1, max_length=500)
    storage_url: str | None = None
    cover_image_url: str | None = None


class MaterialCreate(MaterialBase):
    uploaded_by_id: int | None = None


class MaterialUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    author: str | None = Field(default=None, max_length=255)
    material_type: MaterialType | None = None
    education_level: EducationLevel | None = None
    school_class: str | None = Field(default=None, max_length=30)
    subject: str | None = Field(default=None, max_length=120)
    school_name: str | None = Field(default=None, max_length=255)
    year: int | None = Field(default=None, ge=1900, le=2100)
    seniority: str | None = Field(default=None, max_length=20)
    description: str | None = None
    file_name: str | None = Field(default=None, max_length=255)
    file_size_bytes: int | None = Field(default=None, ge=0)
    mime_type: str | None = Field(default=None, max_length=120)
    storage_key: str | None = Field(default=None, max_length=500)
    storage_url: str | None = None
    cover_image_url: str | None = None
    is_published: bool | None = None


class MaterialRead(MaterialBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    dedupe_key: str
    download_count: int
    last_downloaded_at: datetime | None = None
    is_published: bool
    uploaded_by: UserSummary | None = None
    created_at: datetime
    updated_at: datetime | None = None


class MaterialListResponse(BaseModel):
    items: list[MaterialRead]
    total: int


class MaterialDownloadResponse(BaseModel):
    material_id: int
    download_url: str
    token: str | None = None
    expires_in_seconds: int | None = None


class MaterialFilters(BaseModel):
    query: str | None = None
    education_level: EducationLevel | None = None
    school_class: str | None = None
    subject: str | None = None
    material_type: MaterialType | None = None
    school_name: str | None = None
    year: int | None = None
    uploaded_by_id: int | None = None

