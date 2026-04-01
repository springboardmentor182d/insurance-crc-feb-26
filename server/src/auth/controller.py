from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.models import (
    AdminLogin,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    GoogleAuthRequest,
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from src.auth.service import AuthService
from src.database.core import get_db

router = APIRouter(tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return AuthService(db).register(data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return AuthService(db).login(data)


@router.post("/admin/login", response_model=TokenResponse)
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    return AuthService(db).admin_login(data)


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    return AuthService(db).refresh(data.refresh_token)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return AuthService(db).forgot_password(data)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return AuthService(db).reset_password(data)


@router.post("/google", response_model=TokenResponse)
def google_auth(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    return AuthService(db).google_auth(data)


@router.post("/logout", status_code=204)
def logout():
    return None
