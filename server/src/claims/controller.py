from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

<<<<<<< HEAD
from src.database.core import get_db
from src.database.admin_dashboard.models.claims import Claim, ClaimStatus
from src.claims.schema import ClaimCreateRequest
=======
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
>>>>>>> 8e4b66ad0c7dfd042e2fd6d882788e4e1d90f620

router = APIRouter(prefix="/api/v1/claims", tags=["Claims"])


<<<<<<< HEAD
# ✅ CREATE CLAIM
@router.post("")
def create_claim(payload: ClaimCreateRequest, db: Session = Depends(get_db)):
=======
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
>>>>>>> 8e4b66ad0c7dfd042e2fd6d882788e4e1d90f620

    claim = Claim(
        policy_id=payload.policy_id,
        user_id=1,
        claim_amount=payload.amount,
        description=payload.description,

        incident_date=payload.date,
        incident_time=payload.time,
        location=payload.location,
        report_number=payload.report_number,
        witnesses=payload.witnesses,
        additional_info=payload.additional,

        status=ClaimStatus.PENDING.value  # ✅ important
    )

    db.add(claim)
    db.flush()

    claim.claim_number = f"CLM-{datetime.utcnow().year}-{claim.id:05d}"

    db.commit()

    return {
        "id": claim.id,
        "claim_number": claim.claim_number,
        "status": claim.status
    }


# ✅ GET ALL CLAIMS
@router.get("")
def get_claims(db: Session = Depends(get_db)):

    claims = db.query(Claim).all()

    return [
        {
            "id": c.id,
            "claim_number": c.claim_number,
            "claim_amount": c.claim_amount,
            "status": c.status,
            "submitted_at": c.submitted_at,
        }
        for c in claims
    ]


# ✅ GET CLAIM DETAILS
@router.get("/{claim_id}")
def get_claim(claim_id: int, db: Session = Depends(get_db)):

    claim = db.get(Claim, claim_id)

    if not claim:
        raise HTTPException(status_code=404, detail="Not found")

    return claim