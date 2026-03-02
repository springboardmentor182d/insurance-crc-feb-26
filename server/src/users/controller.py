from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.core import get_db
from src.auth import get_current_user
from src.users.models import (
    ProfileBase,
    ProfileResponse,
    PreferencesBase,
    PreferencesResponse,
)
from src.users.service import UserService


router = APIRouter(tags=["Users"])


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's profile."""
    user = await UserService.get_user_profile(db, current_user["id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileBase,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user's profile."""
    try:
        user = await UserService.update_user_profile(
            db, current_user["id"], profile_data
        )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/preferences", response_model=PreferencesResponse)
async def get_preferences(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's preferences."""
    preferences = await UserService.get_user_preferences(
        db, current_user["id"]
    )
    return preferences


@router.put("/preferences", response_model=PreferencesResponse)
async def update_preferences(
    preferences_data: PreferencesBase,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user's preferences."""
    preferences = await UserService.update_user_preferences(
        db, current_user["id"], preferences_data
    )
    return preferences
