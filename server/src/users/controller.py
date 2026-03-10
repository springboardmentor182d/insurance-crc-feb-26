from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.users.models import ProfileBase, ProfileResponse, PreferencesBase, PreferencesResponse
from src.users.service import (
    get_user_profile,
    update_user_profile,
    get_user_preferences,
    update_user_preferences,
)
from src.auth.jwt import get_current_user_id

router = APIRouter()


@router.get("/profile", response_model=ProfileResponse)
def get_profile(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get current user's profile"""
    user = get_user_profile(db, current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileBase,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    try:
        user = update_user_profile(db, current_user_id, profile_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/preferences", response_model=PreferencesResponse)
def get_preferences(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get current user's preferences"""
    preferences = get_user_preferences(db, current_user_id)
    return preferences


@router.put("/preferences", response_model=PreferencesResponse)
def update_preferences(
    preferences_data: PreferencesBase,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    preferences = update_user_preferences(db, current_user_id, preferences_data)
    return preferences