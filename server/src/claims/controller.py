from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from src.database.core import get_db
from src.database.admin_dashboard.models.claims import Claim, ClaimStatus
from src.claims.schema import ClaimCreateRequest

router = APIRouter(prefix="/api/v1/claims", tags=["Claims"])


# ✅ CREATE CLAIM
@router.post("")
def create_claim(payload: ClaimCreateRequest, db: Session = Depends(get_db)):

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