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


# ✅ FIXED ENUM USAGE (LOWERCASE)
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


# ---------------- HELPERS ----------------

def _enum_value(value) -> str:
    return getattr(value, "value", str(value))


def _to_title(value: str | None) -> str:
    if not value:
        return ""
    return value.replace("_", " ").title()


def _to_float(value):
    return float(value) if value else 0.0


def _to_iso_date(value):
    if not value:
        return ""
    return value.date().isoformat() if isinstance(value, datetime) else value.isoformat()


def _admin_status(status):
    raw_status = _enum_value(status).lower()
    if raw_status == ClaimStatus.PENDING.value:
        return "under_review"
    return raw_status


# ---------------- MAIN FUNCTIONS ----------------

def fetch_all_claims(db: Session, status_filter: str | None = None):
    claims = (
        db.query(Claim)
        .options(joinedload(Claim.user), joinedload(Claim.policy))
        .filter(Claim.status != ClaimStatus.FRAUDULENT)
        .order_by(Claim.submitted_at.desc())
        .all()
    )

    normalized_filter = (status_filter or "").lower()

    if normalized_filter in FILTERABLE_STATUSES:
        claims = [c for c in claims if _admin_status(c.status) == normalized_filter]

    return {
   
    "stats": {
        "total": len(claims),
        "under_review": sum(1 for c in claims if c.status.value == "PENDING"),
        "approved": sum(1 for c in claims if c.status.value == "APPROVED"),
        "rejected": sum(1 for c in claims if c.status.value == "REJECTED"),
    },
    "claims": [
        {
            "claim_id": c.claim_number,
            "user_name": c.user.full_name if c.user else None,
            "user_email": c.user.email if c.user else None,
            "policy_type": c.policy.policy_type if c.policy else None,
            "policy_number": c.policy.policy_number if c.policy else None,
            "incident_type": c.description,
           "submitted_date": c.submitted_at.isoformat() if c.submitted_at else None,
            "amount": float(c.claim_amount),
            "status": c.status.value,
        }
        for c in claims
    ]
}


def fetch_claim_detail(db: Session, claim_id: str):
    claim = (
        db.query(Claim)
        .options(joinedload(Claim.user), joinedload(Claim.policy))
        .filter(Claim.claim_number == claim_id)
        .first()
    )

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    return {
        "claim_id": claim.claim_number,
        "status": _admin_status(claim.status),
        "amount": float(claim.claim_amount),
        "description": claim.description,
    }


def process_claim_action(db: Session, claim_id: str, new_status: str, review_notes: str | None):
    db_status = ACTIONABLE_STATUSES.get(new_status)

    if not db_status:
        raise HTTPException(status_code=400, detail="Invalid status")

    claim = (
        db.query(Claim)
        .options(joinedload(Claim.user), joinedload(Claim.policy))
        .filter(Claim.claim_number == claim_id)
        .first()
    )

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    if claim.status in TERMINAL_STATUSES:
        raise HTTPException(status_code=409, detail="Already processed")

    claim.status = db_status
    claim.review_notes = review_notes
    claim.processed_at = datetime.now(timezone.utc)

    db.commit()

    return {
        "message": f"Claim {new_status} successfully"
    }