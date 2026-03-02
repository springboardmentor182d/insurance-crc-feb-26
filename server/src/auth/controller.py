from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.core import get_db
from src.auth.service import AuthService
from src.auth.models import LoginRequest, RegisterRequest, AdminLogin, TokenResponse, RefreshTokenRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    return await AuthService(db).register(data)

@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    return await AuthService(db).login(data)

@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(
    data: AdminLogin,
    db: AsyncSession = Depends(get_db)
):
    return await AuthService(db).admin_login(data)

@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    return await AuthService(db).refresh(data.refresh_token)

@router.post("/logout", status_code=204)
async def logout():
    return None
