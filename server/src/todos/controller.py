from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.users.models import UserUpdate, UserProfileResponse
from src.users.service import UserService
from src.auth import get_current_user
from src.database.core import get_db

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await UserService(db).get_profile(current_user["id"])


@router.patch("/me", response_model=UserProfileResponse)
async def update_my_profile(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await UserService(db).update_profile(current_user["id"], data)