from sqlalchemy.orm import Session
from datetime import date

from entities.profile import UserProfile
from entities.user import User
from profile.models import ProfileUpdate, ProfileResponse, AccountStats


def _get_or_create(user_id: int, db: Session) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def _years_member(user: User) -> int:
    today  = date.today()
    joined = user.created_at.date() if user.created_at else today
    return (today - joined).days // 365


def _build_stats(user_id: int, user: User, db: Session) -> AccountStats:
    # TODO: replace placeholders with real Policy / Claim queries
    return AccountStats(
        active_policies=4,
        claims_approved=8,
        years_member=_years_member(user),
        claims_paid=15000.0,
    )


def _to_response(profile: UserProfile, user: User, db: Session) -> ProfileResponse:
    return ProfileResponse(
        id=profile.id,
        user_id=user.id,
        full_name=profile.full_name or user.full_name,
        email=user.email,
        phone_number=profile.phone_number,
        date_of_birth=profile.date_of_birth,
        occupation=profile.occupation,
        annual_income=profile.annual_income,
        street_address=profile.street_address,
        city=profile.city,
        state=profile.state,
        zip_code=profile.zip_code,
        is_verified=user.is_verified,
        stats=_build_stats(user.id, user, db),
    )


def get_profile(user: User, db: Session) -> ProfileResponse:
    profile = _get_or_create(user.id, db)
    return _to_response(profile, user, db)


def update_profile(payload: ProfileUpdate, user: User, db: Session) -> ProfileResponse:
    profile = _get_or_create(user.id, db)
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return _to_response(profile, user, db)