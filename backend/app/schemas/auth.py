from __future__ import annotations

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.core.taxonomy import Gender, Role
from app.schemas.common import UserSummary


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=64)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=32)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)
    role: Role = Role.STUDENT
    gender: Gender | None = None
    district: str | None = Field(default=None, max_length=120)
    school_name: str | None = Field(default=None, max_length=255)
    education_level: str | None = Field(default=None, max_length=20)
    school_class: str | None = Field(default=None, max_length=30)


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=3, max_length=128)
    password: str = Field(min_length=8, max_length=128)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSummary

