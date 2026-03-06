from sqlalchemy.orm import Session
from src.entities.user import User


def get_user_profile(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_user_profile(db: Session, user_id: int, data):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    for field, value in data.dict(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


def update_user_preferences(db: Session, user_id: int, preferences: dict):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    user.preferences = preferences
    db.commit()
    db.refresh(user)
    return user