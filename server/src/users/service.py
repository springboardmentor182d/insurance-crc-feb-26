from sqlalchemy.orm import Session
from src.entities.user import User, UserPreferences
from src.users.models import ProfileBase, PreferencesBase
from typing import Optional
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
    """Get user profile by user ID"""
    return db.query(User).filter(User.id == user_id).first()

def update_user_profile(db: Session, user_id: int, profile_data: ProfileBase) -> User:
    """Update user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
    
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

def get_user_preferences(db: Session, user_id: int) -> Optional[UserPreferences]:
    """Get user preferences by user ID"""
    preferences = db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()
    
    # Create default preferences if they don't exist
    preferences = (
        db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()
    )

    if not preferences:
        preferences = UserPreferences(user_id=user_id)
        db.add(preferences)
        db.commit()
        db.refresh(preferences)
    
    return preferences

def update_user_preferences(db: Session, user_id: int, preferences_data: PreferencesBase) -> UserPreferences:
    """Update user preferences"""
    preferences = db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()
    
def update_user_preferences(
    db: Session,
    user_id: int,
    preferences_data: PreferencesBase,
) -> UserPreferences:
    preferences = (
        db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()
    )

    if not preferences:
        # Create new preferences if they don't exist
        preferences = UserPreferences(user_id=user_id)
        db.add(preferences)
    
    update_data = preferences_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(preferences, field, value)
    
    db.commit()
    db.refresh(preferences)
    return preferences
