from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.database import configure_engine, init_db
from app.internal import admin_router
from app.routers import auth_router, health_router, materials_router, users_router


def create_app(database_url: str | None = None) -> FastAPI:
    settings = get_settings()
    configure_engine(database_url)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if settings.auto_create_tables:
            init_db()
        yield

    app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    def root() -> dict[str, str]:
        return {"name": settings.app_name, "status": "running", "version": app.version}

    app.include_router(health_router, prefix=settings.api_v1_prefix)
    app.include_router(auth_router, prefix=settings.api_v1_prefix)
    app.include_router(users_router, prefix=settings.api_v1_prefix)
    app.include_router(materials_router, prefix=settings.api_v1_prefix)
    app.include_router(admin_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()


