from app.schemas.auth import AuthTokenResponse, LoginRequest, RegisterRequest
from app.schemas.common import APIMessage, TimestampedResponse, UserSummary
from app.schemas.materials import (
    MaterialCreate,
    MaterialDownloadResponse,
    MaterialFilters,
    MaterialListResponse,
    MaterialRead,
    MaterialUpdate,
)
from app.schemas.users import UserListResponse, UserProfileUpdate, UserRead

__all__ = [
    "APIMessage",
    "AuthTokenResponse",
    "LoginRequest",
    "MaterialCreate",
    "MaterialDownloadResponse",
    "MaterialFilters",
    "MaterialListResponse",
    "MaterialRead",
    "MaterialUpdate",
    "RegisterRequest",
    "TimestampedResponse",
    "UserListResponse",
    "UserProfileUpdate",
    "UserRead",
    "UserSummary",
]

