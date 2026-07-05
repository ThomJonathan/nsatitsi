from __future__ import annotations

from dataclasses import dataclass, field
from functools import lru_cache
import os
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    app_name: str = field(default_factory=lambda: os.getenv("APP_NAME", "Nsatitsi API"))
    app_env: str = field(default_factory=lambda: os.getenv("APP_ENV", "development"))
    api_v1_prefix: str = field(default_factory=lambda: os.getenv("API_V1_PREFIX", "/api/v1"))
    database_url: str = field(
        default_factory=lambda: os.getenv("DATABASE_URL", f"sqlite:///{Path(__file__).resolve().parents[3] / 'nsatitsi.db'}")
    )
    auth_secret: str = field(default_factory=lambda: os.getenv("AUTH_SECRET", "change-me-in-production"))
    auth_token_ttl_minutes: int = field(default_factory=lambda: int(os.getenv("AUTH_TOKEN_TTL_MINUTES", "1440")))
    mega_download_base_url: str = field(default_factory=lambda: os.getenv("MEGA_DOWNLOAD_BASE_URL", ""))
    cors_origins: tuple[str, ...] = field(
        default_factory=lambda: tuple(
            origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if origin.strip()
        )
    )
    auto_create_tables: bool = field(default_factory=lambda: os.getenv("AUTO_CREATE_TABLES", "true").lower() == "true")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

