from __future__ import annotations

from dataclasses import dataclass, field
from functools import lru_cache
import os
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables from .env file
env_file = Path(__file__).resolve().parents[2] / ".env"
if env_file.exists():
    load_dotenv(env_file)

@dataclass(frozen=True)
class Settings:
    app_name: str = field(default_factory=lambda: os.getenv("APP_NAME", "Nsatitsi API"))
    app_env: str = field(default_factory=lambda: os.getenv("APP_ENV", "development"))
    api_v1_prefix: str = field(default_factory=lambda: os.getenv("API_V1_PREFIX", "/api/v1"))
    database_url: str = field(
        default_factory=lambda: os.getenv("DATABASE_URL", "")
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
    settings = Settings()

    # Validate DATABASE_URL is set and uses PostgreSQL
    if not settings.database_url:
        raise ValueError("DATABASE_URL environment variable must be set")

    if not settings.database_url.startswith("postgresql"):
        raise ValueError("DATABASE_URL must use PostgreSQL (postgresql+psycopg://...)")

    return settings
