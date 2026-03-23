from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import SessionLocal
from src.auth.routes import get_current_user
from src.entities.user import User
from src.users.service import (
    get_user_profile,
    update_user_profile,
    update_user_preferences,
)
from src.users.models import (
    UserProfileResponse,
    UpdateProfileRequest,
    UpdatePreferencesRequest,
)

router = APIRouter(prefix="/users", tags=["Users"])


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# TEMP: hardcoded user_id = 1
current_user = Depends(get_current_user)

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ✅ from JWT
):
    user = get_user_profile(db, current_user.id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.put("/profile", response_model=UserProfileResponse)
def update_profile(
    request: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = update_user_profile(db, current_user.id, request)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.put("/preferences", response_model=UserProfileResponse)
def update_preferences(
    request: UpdatePreferencesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = update_user_preferences(
        db,
        current_user.id,
        request.dict()
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user