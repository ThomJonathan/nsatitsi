from __future__ import annotations

from fastapi import APIRouter, Depends, Header, Request, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, require_admin
from app.db.database import get_db
from app.models.material import Material
from app.models.user import User
from app.schemas.materials import (
    MaterialCreate,
    MaterialDownloadResponse,
    MaterialFilters,
    MaterialListResponse,
    MaterialRead,
    MaterialUpdate,
)
from app.services.material_service import material_service

router = APIRouter(prefix="/materials", tags=["materials"])


@router.get("", response_model=MaterialListResponse)
def list_materials(filters: MaterialFilters = Depends(), session: Session = Depends(get_db)) -> MaterialListResponse:
    items, total = material_service.list_materials(session, filters)
    return MaterialListResponse(items=[MaterialRead.model_validate(item) for item in items], total=total)


@router.get("/{material_id}", response_model=MaterialRead)
def get_material(material_id: int, session: Session = Depends(get_db)) -> MaterialRead:
    material = material_service.get_material(session, material_id)
    return MaterialRead.model_validate(material)


@router.post("", response_model=MaterialRead, status_code=status.HTTP_201_CREATED)
def create_material(
    payload: MaterialCreate,
    session: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> MaterialRead:
    if payload.uploaded_by_id is None:
        payload.uploaded_by_id = current_user.id
    material = material_service.create_material(session, payload)
    return MaterialRead.model_validate(material)


@router.patch("/{material_id}", response_model=MaterialRead)
def update_material(
    material_id: int,
    payload: MaterialUpdate,
    session: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> MaterialRead:
    material = material_service.get_material(session, material_id)
    updated = material_service.update_material(session, material, payload)
    return MaterialRead.model_validate(updated)


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(
    material_id: int,
    session: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> None:
    material = material_service.get_material(session, material_id)
    material_service.delete_material(session, material)


@router.post("/{material_id}/download", response_model=MaterialDownloadResponse)
def download_material(
    material_id: int,
    request: Request,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    user_agent: str | None = Header(default=None, alias="User-Agent"),
) -> MaterialDownloadResponse:
    material = material_service.get_material(session, material_id)
    download_url = material_service.register_download(
        session,
        material,
        current_user,
        ip_address=request.client.host if request.client else None,
        user_agent=user_agent,
    )
    return MaterialDownloadResponse(
        material_id=material.id,
        download_url=download_url,
        expires_in_seconds=0,
    )

