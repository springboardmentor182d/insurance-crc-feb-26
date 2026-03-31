from sqlalchemy.orm import Session
from fastapi import HTTPException

from entities.user import User
from users.models import UserResponse, UserUpdate


def get_user(user_id: int, db: Session) -> UserResponse:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)


def update_user(user_id: int, payload: UserUpdate, db: Session) -> UserResponse:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


def get_me(current_user: User) -> UserResponse:
    return UserResponse.model_validate(current_user)