from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.core import get_db
from auth.service import get_current_user
from entities.user import User
from preferences.models import (
    InsurancePreferencesUpdate,
    NotificationPreferencesUpdate,
    AdditionalSettingsUpdate,
    PreferencesResponse,
)
import preferences.service as service

router = APIRouter(prefix="/preferences", tags=["Preferences"])


@router.get("/", response_model=PreferencesResponse)
def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.get_preferences(current_user, db)


@router.put("/insurance", response_model=PreferencesResponse)
def update_insurance(
    payload: InsurancePreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update_insurance(payload, current_user, db)


@router.put("/notifications", response_model=PreferencesResponse)
def update_notifications(
    payload: NotificationPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update_notifications(payload, current_user, db)


@router.put("/settings", response_model=PreferencesResponse)
def update_settings(
    payload: AdditionalSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update_settings(payload, current_user, db)