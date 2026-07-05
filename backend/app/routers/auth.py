from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import AuthTokenResponse, LoginRequest, RegisterRequest
from app.schemas.common import UserSummary
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthTokenResponse)
def register(payload: RegisterRequest, session: Session = Depends(get_db)) -> AuthTokenResponse:
    return auth_service.register(session, payload)


@router.post("/login", response_model=AuthTokenResponse)
def login(payload: LoginRequest, session: Session = Depends(get_db)) -> AuthTokenResponse:
    return auth_service.login(session, payload)


@router.get("/me", response_model=UserSummary)
def me(current_user: User = Depends(get_current_user)) -> UserSummary:
    return UserSummary.model_validate(current_user)

