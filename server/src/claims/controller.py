from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from src.auth import get_current_user_id
from src.database.core import get_db, SessionLocal
from src.database.admin_dashboard.enums.activity import ActivitySeverity, ActivityType
from src.database.admin_dashboard.models import ActivityLog, Claim, ClaimStatus, Policy
from src.services.fraud_engine import run_fraud_checks


class ClaimCreateRequest(BaseModel):
    policy_id: int
    claim_amount: float
    description: str | None = None


router = APIRouter(prefix="/claims", tags=["Claims"])


def run_fraud_checks_background(claim_id: int) -> None:
    with SessionLocal() as session:
        run_fraud_checks(claim_id, session)


def _to_title(value: str | None) -> str:
    if not value:
        return ""
    return value.replace("_", " ").title()


def _enum_value(value) -> str:
    return getattr(value, "value", str(value))


def _serialize_claim(claim: Claim) -> dict[str, str]:
    raw_status = _enum_value(claim.status).lower()
    status_map = {
        "pending": "Pending",
        "approved": "Resolved",
        "rejected": "Rejected",
        "fraudulent": "Fraudulent",
    }
    claim_type = (
        _to_title(_enum_value(claim.policy.policy_type))
        if claim.policy is not None
        else "Policy"
    )

    return {
        "id": claim.claim_number or f"CLM-{claim.id}",
        "type": claim_type,
        "date": claim.submitted_at.date().isoformat() if claim.submitted_at else "",
        "amount": f"${float(claim.claim_amount):,.2f}",
        "status": status_map.get(raw_status, _to_title(raw_status)),
    }


@router.get("")
def list_claims(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    claims = (
        db.query(Claim)
        .options(joinedload(Claim.policy))
        .filter(Claim.user_id == current_user_id)
        .order_by(Claim.submitted_at.desc())
        .all()
    )
    return [_serialize_claim(claim) for claim in claims]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_claim(
    payload: ClaimCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    policy = db.get(Policy, payload.policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    claim = Claim(
        policy_id=payload.policy_id,
        user_id=current_user_id,
        status=ClaimStatus.PENDING,
        claim_amount=payload.claim_amount,
        description=payload.description,
        submitted_at=datetime.utcnow(),
    )
    db.add(claim)
    db.flush()

    claim.claim_number = f"CLM-{datetime.utcnow().year}-{claim.id:05d}"

    db.add(
        ActivityLog(
            user_id=current_user_id,
            title=f"Claim {claim.claim_number} submitted",
            action_type=ActivityType.CLAIM_SUBMITTED,
            severity=ActivitySeverity.INFO,
            entity_type="claim",
            entity_id=claim.id,
        )
    )

    db.commit()

    background_tasks.add_task(run_fraud_checks_background, claim.id)

    return {
        "id": claim.id,
        "claim_number": claim.claim_number,
        "status": claim.status.value,
    }
