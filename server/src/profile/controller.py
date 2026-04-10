from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.core import get_db
from auth.service import get_current_user
from entities.user import User
from profile.models import ProfileUpdate, ProfileResponse
import profile.service as service

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.get_profile(current_user, db)


@router.put("/", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update_profile(payload, current_user, db)