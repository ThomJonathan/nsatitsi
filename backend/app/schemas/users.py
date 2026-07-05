from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.core.taxonomy import Gender
from app.schemas.common import UserSummary


class UserProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, max_length=255)
    phone: str | None = Field(default=None, max_length=32)
    gender: Gender | None = None
    district: str | None = Field(default=None, max_length=120)
    school_name: str | None = Field(default=None, max_length=255)
    education_level: str | None = Field(default=None, max_length=20)
    school_class: str | None = Field(default=None, max_length=30)


class UserRead(UserSummary):
    model_config = ConfigDict(from_attributes=True)

    email: str | None = None
    phone: str | None = None
    gender: str | None = None
    school_name: str | None = None
    is_active: bool = True


class UserListResponse(BaseModel):
    items: list[UserRead]
    total: int

