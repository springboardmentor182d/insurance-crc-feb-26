from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status

from entities.preferences import UserPreferences
from entities.user import User
from preferences.models import (
    InsurancePreferencesUpdate,
    NotificationPreferencesUpdate,
    AdditionalSettingsUpdate,
    PreferencesResponse,
)


def _get_or_create(user_id: int, db: Session) -> UserPreferences:
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()
    if not prefs:
        prefs = UserPreferences(user_id=user_id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs


def _to_response(prefs: UserPreferences) -> PreferencesResponse:
    interests: List[str] = (
        [i.strip() for i in prefs.policy_interests.split(",") if i.strip()]
        if prefs.policy_interests else []
    )
    return PreferencesResponse(
        id=prefs.id,
        user_id=prefs.user_id,
        risk_tolerance=prefs.risk_tolerance,
        policy_interests=interests,
        budget_min=prefs.budget_min,
        budget_max=prefs.budget_max,
        email_notifications=prefs.email_notifications,
        sms_notifications=prefs.sms_notifications,
        push_notifications=prefs.push_notifications,
        marketing_communications=prefs.marketing_communications,
        ai_recommendations=prefs.ai_recommendations,
        weekly_summary=prefs.weekly_summary,
    )


def get_preferences(user: User, db: Session) -> PreferencesResponse:
    prefs = _get_or_create(user.id, db)
    return _to_response(prefs)


def update_insurance(
    payload: InsurancePreferencesUpdate, user: User, db: Session
) -> PreferencesResponse:
    prefs = _get_or_create(user.id, db)

    if payload.risk_tolerance is not None:
        if payload.risk_tolerance not in {"low", "medium", "high"}:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="risk_tolerance must be 'low', 'medium', or 'high'",
            )
        prefs.risk_tolerance = payload.risk_tolerance

    if payload.policy_interests is not None:
        prefs.policy_interests = ",".join(payload.policy_interests)

    if payload.budget_min is not None:
        prefs.budget_min = payload.budget_min

    if payload.budget_max is not None:
        prefs.budget_max = payload.budget_max

    db.commit()
    db.refresh(prefs)
    return _to_response(prefs)


def update_notifications(
    payload: NotificationPreferencesUpdate, user: User, db: Session
) -> PreferencesResponse:
    prefs = _get_or_create(user.id, db)
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(prefs, field, value)
    db.commit()
    db.refresh(prefs)
    return _to_response(prefs)


def update_settings(
    payload: AdditionalSettingsUpdate, user: User, db: Session
) -> PreferencesResponse:
    prefs = _get_or_create(user.id, db)
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(prefs, field, value)
    db.commit()
    db.refresh(prefs)
    return _to_response(prefs)