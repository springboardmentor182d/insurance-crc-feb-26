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
from src.database.admin_dashboard.models import ActivityLog, Claim, ClaimStatus, User, UserRole
from src.entities.active_policy import ActivePolicy
from src.storage.document_storage import get_document_storage


# ✅ FIXED ENUM USAGE (LOWERCASE)
ACTIONABLE_STATUSES = {
    "approved": ClaimStatus.approved,
    "rejected": ClaimStatus.rejected,
}

TERMINAL_STATUSES = {ClaimStatus.approved, ClaimStatus.rejected}

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


def _incident_type(description: str | None) -> str:
    text = (description or "").lower()
    for keyword, label in INCIDENT_KEYWORDS.items():
        if keyword in text:
            return label
    return "General Claim"


def _admin_status(status):
    raw_status = _enum_value(status).lower()
    if raw_status == ClaimStatus.pending.value:
        return "under_review"
    return raw_status


# ---------------- MAIN FUNCTIONS ----------------

def fetch_all_claims(db: Session, status_filter: str | None = None):
    claims = (
        db.query(Claim)
        .options(joinedload(Claim.user), joinedload(Claim.policy))
        .join(User, Claim.user_id == User.id)
        .filter(
            Claim.status != ClaimStatus.fraudulent,
            User.role == UserRole.CUSTOMER,
        )
        .order_by(Claim.submitted_at.desc())
        .all()
    )

    normalized_filter = (status_filter or "").lower()

    if normalized_filter in FILTERABLE_STATUSES:
        claims = [c for c in claims if _admin_status(c.status) == normalized_filter]

    stats = {
        "total": len(claims),
        "under_review": sum(1 for c in claims if _admin_status(c.status) == "under_review"),
        "approved": sum(1 for c in claims if _admin_status(c.status) == "approved"),
        "rejected": sum(1 for c in claims if _admin_status(c.status) == "rejected"),
    }

    return {
        "stats": stats,
        "claims": [
            {
                "claim_id": c.claim_number,
                "user_name": c.user.full_name if c.user else "",
                "user_email": c.user.email if c.user else "",
                "policy_type": _to_title(_enum_value(c.policy.policy_type)) if c.policy else "",
                "policy_number": c.policy.policy_number if c.policy else "",
                "incident_type": _incident_type(c.description),
                "amount": float(c.claim_amount),
                "submitted_date": _to_iso_date(c.submitted_at),
                "status": _admin_status(c.status),
            }
            for c in claims
        ]
    }


def fetch_claim_detail(db: Session, claim_id: str):
    claim = (
        db.query(Claim)
        .options(joinedload(Claim.user), joinedload(Claim.policy))
        .join(User, Claim.user_id == User.id)
        .filter(Claim.claim_number == claim_id)
        .first()
    )

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    return {
        "claim_id": claim.claim_number,
        "status": _admin_status(claim.status),
        "policy_type": _to_title(_enum_value(claim.policy.policy_type)) if claim.policy else "",
        "policy_number": claim.policy.policy_number if claim.policy else "",
        "incident_type": _incident_type(claim.description),
        "incident_date": _to_iso_date(claim.submitted_at),
        "amount": float(claim.claim_amount),
        "submitted_date": _to_iso_date(claim.submitted_at),
        "user": {
            "full_name": claim.user.full_name if claim.user else "",
            "email": claim.user.email if claim.user else "",
            "phone": claim.user.phone or "Not provided" if claim.user else "Not provided",
            "address": claim.user.address or "Not provided" if claim.user else "Not provided",
        },
        "incident_description": claim.description or "",
        "review_notes": claim.review_notes,
        "documents": [],
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

    if db_status == ClaimStatus.approved:
        storage = get_document_storage()
        active_policies = (
            db.query(ActivePolicy)
            .options(joinedload(ActivePolicy.documents))
            .filter(
                ActivePolicy.user_id == claim.user_id,
                ActivePolicy.policy_id == claim.policy_id,
            )
            .all()
        )

        for active_policy in active_policies:
            for document in active_policy.documents:
                storage.delete(document.storage_key)
            db.delete(active_policy)

    db.commit()

    return {
        "success": True,
        "message": f"Claim {new_status} successfully",
        "claim_id": claim.claim_number,
        "new_status": _admin_status(claim.status),
    }
