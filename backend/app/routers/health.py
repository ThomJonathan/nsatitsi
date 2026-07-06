from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.database import get_db
from app.models.material import Material
from app.models.user import User
from app.core.taxonomy import Role

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    settings = get_settings()
    return {"status": "ok", "app_name": settings.app_name, "environment": settings.app_env}


@router.get("/stats")
def public_stats(session: Session = Depends(get_db)) -> dict[str, int]:
    """Public stats endpoint for landing page - no auth required"""
    total_materials = session.scalar(select(func.count()).select_from(Material)) or 0
    total_students = session.scalar(
        select(func.count()).select_from(User).where(User.role == Role.STUDENT.value)
    ) or 0
    return {"materials": total_materials, "students": total_students}
