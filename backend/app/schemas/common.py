from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class APIMessage(BaseModel):
    message: str


class TimestampedResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    created_at: datetime
    updated_at: datetime | None = None


class UserSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    role: str
    full_name: str | None = None
    education_level: str | None = None
    school_class: str | None = None
    school_name: str | None = None
    district: str | None = None

