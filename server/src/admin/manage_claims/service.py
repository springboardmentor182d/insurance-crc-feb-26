"""
Claims service layer.
─────────────────────────────────────────────────────────────────────────────
All business logic lives here. The controller (manage_claims\controller.py) only
handles HTTP concerns — it delegates everything to these functions.

When you switch to a real DB:
  • Replace the imports from mock_data with SQLAlchemy session calls.
  • Keep the function signatures identical so the controller needs zero changes.
─────────────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from src.admin.manage_claims.models import (
    ClaimActionResponse,
    ClaimDetail,
    ClaimSummary,
    ClaimsListResponse,
    ClaimsStatsResponse,
    ClaimUserInfo,
)
from src.database.admin_dashboard.enums.activity import ActivitySeverity, ActivityType
from src.database.admin_dashboard.models import ActivityLog, Claim, ClaimStatus, User

ACTIONABLE_STATUSES = {
    "approved": ClaimStatus.APPROVED,
    "rejected": ClaimStatus.REJECTED,
}
TERMINAL_STATUSES = {ClaimStatus.APPROVED, ClaimStatus.REJECTED}
FILTERABLE_STATUSES = {"under_review", "approved", "rejected"}
INCIDENT_KEYWORDS = {
    "collision": "Vehicle Collision",
    "accident": "Road Accident",
    "theft": "Theft",
    "hospital": "Hospitalization",
    "injury": "Injury Treatment",
    "illness": "Illness Claim",
    "water": "Water Damage",
    "leak": "Water Damage",
    "storm": "Storm Damage",
    "hail": "Storm Damage",
    "fire": "Fire Damage",
    "death": "Life Event",
}


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _enum_value(value) -> str:
    return getattr(value, "value", str(value))


def _to_title(value: str | None) -> str:
    if not value:
        return ""
    return value.replace("_", " ").title()


def _to_float(value: Decimal | float | int | None) -> float:
    if value is None:
        return 0.0
    return float(value)


def _to_iso_date(value: datetime | date | None) -> str:
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.date().isoformat()
    return value.isoformat()


def _admin_status(status: ClaimStatus | str) -> str:
    raw_status = _enum_value(status).lower()
    if raw_status == ClaimStatus.PENDING.value:
        return "under_review"
    return raw_status


def _build_user_address(user: User) -> str:
    parts = [
        user.address,
        user.city,
        user.state,
        user.zip_code,
        user.country,
    ]
    values = [part.strip() for part in parts if part and part.strip()]
    return ", ".join(values) if values else "Not provided yet"


def _derive_incident_type(claim: Claim) -> str:
    description = (claim.description or "").strip()
    description_lower = description.lower()
    for keyword, label in INCIDENT_KEYWORDS.items():
        if keyword in description_lower:
            return label

    if claim.policy is not None:
        return f"{_to_title(_enum_value(claim.policy.policy_type))} Claim"
    return "General Claim"


def _incident_date_for_claim(claim: Claim) -> str:
    return _to_iso_date(claim.submitted_at)


def _claim_base_query(db: Session):
    return (
        db.query(Claim)
        .options(joinedload(Claim.user), joinedload(Claim.policy))
        .filter(Claim.status != ClaimStatus.FRAUDULENT)
    )


def _build_claim_summary(claim: Claim) -> ClaimSummary:
    policy = claim.policy
    user = claim.user
    return ClaimSummary(
        claim_id=claim.claim_number or f"CLM-{claim.id}",
        user_name=user.full_name if user is not None else "Unknown User",
        user_email=user.email if user is not None else "",
        policy_type=_to_title(_enum_value(policy.policy_type)) if policy is not None else "Policy",
        policy_number=policy.policy_number if policy is not None else "Not linked",
        incident_type=_derive_incident_type(claim),
        amount=_to_float(claim.claim_amount),
        submitted_date=_to_iso_date(claim.submitted_at),
        status=_admin_status(claim.status),
    )


def _build_claim_detail(claim: Claim) -> ClaimDetail:
    policy = claim.policy
    user = claim.user
    return ClaimDetail(
        claim_id=claim.claim_number or f"CLM-{claim.id}",
        status=_admin_status(claim.status),
        policy_type=_to_title(_enum_value(policy.policy_type)) if policy is not None else "Policy",
        policy_number=policy.policy_number if policy is not None else "Not linked",
        incident_type=_derive_incident_type(claim),
        incident_date=_incident_date_for_claim(claim),
        amount=_to_float(claim.claim_amount),
        submitted_date=_to_iso_date(claim.submitted_at),
        user=ClaimUserInfo(
            full_name=user.full_name if user is not None else "Unknown User",
            email=user.email if user is not None else "",
            phone=(user.phone or "Not provided yet") if user is not None else "Not provided yet",
            address=_build_user_address(user) if user is not None else "Not provided yet",
        ),
        incident_description=(claim.description or "Claim description not provided yet.").strip(),
        review_notes=(claim.review_notes or "").strip() or None,
        documents=[],
    )


def _compute_stats(claims: list[Claim]) -> ClaimsStatsResponse:
    normalized_statuses = [_admin_status(claim.status) for claim in claims]
    return ClaimsStatsResponse(
        total=len(claims),
        under_review=sum(1 for status in normalized_statuses if status == "under_review"),
        approved=sum(1 for status in normalized_statuses if status == "approved"),
        rejected=sum(1 for status in normalized_statuses if status == "rejected"),
    )


# ---------------------------------------------------------------------------
# Public service functions (called by the controller)
# ---------------------------------------------------------------------------

def fetch_all_claims(db: Session, status_filter: str | None = None) -> ClaimsListResponse:
    claims = _claim_base_query(db).order_by(Claim.submitted_at.desc()).all()
    stats = _compute_stats(claims)

    normalized_filter = (status_filter or "").strip().lower()
    if normalized_filter in FILTERABLE_STATUSES:
        claims = [claim for claim in claims if _admin_status(claim.status) == normalized_filter]

    return ClaimsListResponse(
        stats=stats,
        claims=[_build_claim_summary(claim) for claim in claims],
    )


def fetch_claim_detail(db: Session, claim_id: str) -> ClaimDetail:
    claim = (
        db.query(Claim)
        .options(joinedload(Claim.user), joinedload(Claim.policy))
        .filter(Claim.claim_number == claim_id)
        .first()
    )
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")
    return _build_claim_detail(claim)


def process_claim_action(
    db: Session,
    claim_id: str,
    new_status: str,
    review_notes: str | None,
) -> ClaimActionResponse:
    """
    Approve or reject a claim.

    Rules enforced here:
      • new_status must be 'approved' or 'rejected'.
      • Rejection requires review_notes.
      • Already-terminal claims cannot be changed again.
    """
    db_status = ACTIONABLE_STATUSES.get(new_status)
    if db_status is None:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{new_status}'. Must be one of: {set(ACTIONABLE_STATUSES)}",
        )

    normalized_notes = review_notes.strip() if review_notes else None
    if db_status == ClaimStatus.REJECTED and not normalized_notes:
        raise HTTPException(
            status_code=422,
            detail="Review notes are required when rejecting a claim.",
        )

    claim = (
        db.query(Claim)
        .options(joinedload(Claim.user), joinedload(Claim.policy))
        .filter(Claim.claim_number == claim_id)
        .first()
    )
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")

    if claim.status == ClaimStatus.FRAUDULENT:
        raise HTTPException(
            status_code=409,
            detail=f"Claim '{claim_id}' is flagged as fraudulent. Review it from the flagged claims screen.",
        )

    if claim.status in TERMINAL_STATUSES:
        raise HTTPException(
            status_code=409,
            detail=f"Claim '{claim_id}' is already '{_enum_value(claim.status)}' and cannot be changed.",
        )

    claim.status = db_status
    claim.review_notes = normalized_notes
    claim.processed_at = datetime.now(timezone.utc)
    claim.approved_amount = claim.claim_amount if db_status == ClaimStatus.APPROVED else None

    action_word = "approved" if db_status == ClaimStatus.APPROVED else "rejected"
    db.add(
        ActivityLog(
            title=f"Claim {claim.claim_number} {action_word}",
            action_type=(
                ActivityType.CLAIM_APPROVED
                if db_status == ClaimStatus.APPROVED
                else ActivityType.CLAIM_REJECTED
            ),
            severity=(
                ActivitySeverity.APPROVED
                if db_status == ClaimStatus.APPROVED
                else ActivitySeverity.WARNING
            ),
            user_id=None,
            entity_type="claim",
            entity_id=claim.id,
            details=normalized_notes,
        )
    )
    db.commit()

    return ClaimActionResponse(
        success=True,
        message=f"Claim {claim_id} has been {action_word} successfully.",
        claim_id=claim_id,
        new_status=new_status,
    )
