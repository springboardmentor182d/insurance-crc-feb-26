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

DOC_TYPE_KEYWORDS = {
    "police": "Police Report",
    "report": "Police Report",
    "invoice": "Invoice",
    "receipt": "Receipt",
    "medical": "Medical Report",
    "doctor": "Medical Report",
    "hospital": "Hospital Report",
    "photo": "Photo",
    "image": "Photo",
    "estimate": "Estimate",
    "quote": "Quote",
    "repair": "Repair Report",
}


# ---------------- HELPERS ----------------

def _enum_value(value) -> str:
    return getattr(value, "value", str(value))


def _to_title(value: str | None) -> str:
    if not value:
        return ""
    return value.replace("_", " ").title()


def _safe_text(value, fallback: str = "") -> str:
    if value is None:
        return fallback
    text = str(value).strip()
    return text or fallback


def _to_float(value):
    return float(value) if value else 0.0


def _to_iso_date(value):
    if not value:
        return ""
    return value.date().isoformat() if isinstance(value, datetime) else value.isoformat()


def _format_policy_type(policy) -> str:
    if not policy:
        return "Unknown Policy"
    return _to_title(_enum_value(policy.policy_type)) or "Unknown Policy"


def _build_user_address(user) -> str:
    if not user:
        return "Not provided"

    parts = [
        _safe_text(user.address),
        _safe_text(user.city),
        _safe_text(user.state),
        _safe_text(user.zip_code),
        _safe_text(user.country),
    ]
    joined = ", ".join(part for part in parts if part)
    return joined or "Not provided"


def _derive_incident_type(description: str | None) -> str:
    text = _safe_text(description).lower()
    for keyword, label in INCIDENT_KEYWORDS.items():
        if keyword in text:
            return label
    return "General Claim"


def _derive_doc_type(filename: str | None) -> str:
    """Derive document type from filename"""
    if not filename:
        return "Document"
    text = filename.lower()
    for keyword, label in DOC_TYPE_KEYWORDS.items():
        if keyword in text:
            return label
    return "Document"


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
        "under_review": sum(1 for c in claims if c.status.value == ClaimStatus.PENDING.value),
        "approved": sum(1 for c in claims if c.status.value == ClaimStatus.APPROVED.value),
        "rejected": sum(1 for c in claims if c.status.value == ClaimStatus.REJECTED.value),
    },
    "claims": [
        {
            "claim_id": c.claim_number,
            "user_name": _safe_text(c.user.full_name if c.user else None, "Unknown User"),
            "user_email": _safe_text(c.user.email if c.user else None, "Not provided"),
            "policy_type": _format_policy_type(c.policy),
            "policy_number": _safe_text(c.policy.policy_number if c.policy else None, "Not assigned"),
            "incident_type": _derive_incident_type(c.description),
            "submitted_date": _to_iso_date(c.submitted_at),
            "amount": float(c.claim_amount),
            "status": _admin_status(c.status),
        }
        for c in claims
    ]
}


def fetch_claim_detail(db: Session, claim_id: str):
    claim = (
        db.query(Claim)
        .options(
            joinedload(Claim.user), 
            joinedload(Claim.policy),
            joinedload(Claim.documents)  # ✅ Load documents
        )
        .filter(Claim.claim_number == claim_id)
        .first()
    )

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    submitted_date = _to_iso_date(claim.submitted_at)
    user = claim.user
    policy = claim.policy

    # ✅ Build documents list
    documents = []
    if claim.documents:
        for doc in claim.documents:
            documents.append({
                "name": doc.file_name,
                "doc_type": _derive_doc_type(doc.file_name),  # Extract from filename
                "size_mb": round(doc.file_size / (1024 * 1024), 2),
                "uploaded_date": _to_iso_date(doc.created_at),
            })

    return {
        "claim_id": claim.claim_number,
        "status": _admin_status(claim.status),
        "policy_type": _format_policy_type(policy),
        "policy_number": _safe_text(policy.policy_number if policy else None, "Not assigned"),
        "incident_type": _derive_incident_type(claim.description),
        "incident_date": submitted_date,
        "amount": float(claim.claim_amount),
        "submitted_date": submitted_date,
        "user": {
            "full_name": _safe_text(user.full_name if user else None, "Unknown User"),
            "email": _safe_text(user.email if user else None, "Not provided"),
            "phone": _safe_text(user.phone if user else None, "Not provided"),
            "address": _build_user_address(user),
        },
        "incident_description": _safe_text(claim.description, "No incident description provided."),
        "review_notes": claim.review_notes,
        "documents": documents,  # ✅ Return actual documents
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
        "success": True,
        "message": f"Claim {new_status} successfully",
        "claim_id": claim.claim_number,
        "new_status": _admin_status(claim.status),
    }
