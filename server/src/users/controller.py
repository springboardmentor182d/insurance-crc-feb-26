from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.core import get_db
from auth.service import get_current_user 
from entities.user import User
from users.models import UserResponse, UserUpdate
import users.service as service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently logged in user."""
    return service.get_me(current_user)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.get_user(user_id, db)


@router.put("/me", response_model=UserResponse)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update_user(current_user.id, payload, db)