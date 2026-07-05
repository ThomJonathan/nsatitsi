from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.common import UserSummary
from app.schemas.users import UserProfileUpdate, UserRead
from app.services.auth_service import auth_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def read_my_profile(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.patch("/me", response_model=UserRead)
def update_my_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
) -> UserRead:
    updated = auth_service.update_profile(session, current_user, payload)
    return UserRead.model_validate(updated)

