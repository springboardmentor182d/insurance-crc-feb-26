from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.auth.service import AuthService
from src.auth.models import LoginRequest, RegisterRequest, AdminLogin, TokenResponse, RefreshTokenRequest

router = APIRouter(tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    return AuthService(db).register(data)


@router.post("/login", response_model=TokenResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    return AuthService(db).login(data)


@router.post("/admin/login", response_model=TokenResponse)
def admin_login(
    data: AdminLogin,
    db: Session = Depends(get_db)
):
    return AuthService(db).admin_login(data)


@router.post("/refresh", response_model=TokenResponse)
def refresh(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    return AuthService(db).refresh(data.refresh_token)


@router.post("/logout", status_code=204)
def logout():
    return None