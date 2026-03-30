from typing import Optional
from sqlalchemy.orm import Session
from src.database.admin_dashboard.models.user_preferences import UserPreferences
from src.database.admin_dashboard.models.users import User
from src.users.models import PreferencesBase, ProfileBase

def _merge_full_name(
    first_name: Optional[str],
    last_name: Optional[str],
    fallback: str,
) -> str:
    parts = [part.strip() for part in [first_name, last_name] if part and part.strip()]
    return " ".join(parts) if parts else fallback

def get_user_profile(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def update_user_profile(db: Session, user_id: int, profile_data: ProfileBase) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")

    update_data = profile_data.model_dump(exclude_unset=True)
    profile_fields = {
        "email",
        "phone",
        "first_name",
        "last_name",
        "date_of_birth",
        "gender",
        "address",
        "city",
        "state",
        "zip_code",
        "country",
        "occupation",
        "company",
        "insurance_preferences",
    }

    for field, value in update_data.items():
        if field in profile_fields:
            setattr(user, field, value)

    user.full_name = _merge_full_name(user.first_name, user.last_name, user.full_name)

    db.commit()
    db.refresh(user)
    return user

def get_user_preferences(db: Session, user_id: int) -> Optional[UserPreferences]:
    preferences = (
        db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()
    )

    if not preferences:
        preferences = UserPreferences(user_id=user_id)
        db.add(preferences)
        db.commit()
        db.refresh(preferences)

    return preferences

def update_user_preferences(
    db: Session,
    user_id: int,
    preferences_data: PreferencesBase,
) -> UserPreferences:
    preferences = (
        db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()
    )

    if not preferences:
        preferences = UserPreferences(user_id=user_id)
        db.add(preferences)

    update_data = preferences_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(preferences, field, value)

    db.commit()
    db.refresh(preferences)
    return preferences
