from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.core import get_db
from src.auth import require_admin
from src.auth.models import RegisterRequest, AdminLogin
from src.admin.service import admin_signup, admin_login

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/signup")
async def signup(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    return await admin_signup(data, db)


@router.post("/login")
async def login(
    data: AdminLogin,
    db: AsyncSession = Depends(get_db)
):
    return await admin_login(data, db)