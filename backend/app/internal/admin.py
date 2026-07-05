from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.dependencies import require_admin
from app.db.database import get_db
from app.models.download_log import DownloadLog
from app.models.material import Material
from app.models.user import User
from app.schemas.common import UserSummary
from app.schemas.materials import MaterialRead
from app.schemas.users import UserListResponse, UserRead
from app.services.reporting_service import reporting_service

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
def read_dashboard_stats(
    current_user: User = Depends(require_admin),
    session: Session = Depends(get_db),
) -> dict[str, object]:
    return reporting_service.dashboard_stats(session)


@router.get("/users", response_model=UserListResponse)
def list_users(current_user: User = Depends(require_admin), session: Session = Depends(get_db)) -> UserListResponse:
    users = session.scalars(select(User).order_by(User.created_at.desc())).all()
    return UserListResponse(items=[UserRead.model_validate(user) for user in users], total=len(users))


@router.get("/materials", response_model=list[MaterialRead])
def list_all_materials(current_user: User = Depends(require_admin), session: Session = Depends(get_db)) -> list[MaterialRead]:
    materials = session.scalars(select(Material).order_by(Material.created_at.desc())).all()
    return [MaterialRead.model_validate(material) for material in materials]


@router.get("/downloads")
def list_downloads(current_user: User = Depends(require_admin), session: Session = Depends(get_db)) -> dict[str, object]:
    total = session.scalar(select(func.count()).select_from(DownloadLog)) or 0
    return {"total": total}

