from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from sqlalchemy import or_
from typing import List

from src.database.core import get_db
from src.database.admin_dashboard.models.claims import Claim, ClaimStatus

# ✅ ROUTER
router = APIRouter(prefix="/claims", tags=["Claims"])


# ✅ STATUS MAP (UI friendly)
def map_status(status):
    if status == "pending":
        return "IN_REVIEW"
    if status == "approved":
        return "APPROVED"
    if status == "paid":
        return "PAID"
    if status == "rejected":
        return "REJECTED"
    return status


# ✅ CREATE CLAIM
@router.post("/")
def create_claim(
    policy_id: int = Form(...),
    claim_amount: float = Form(...),
    description: str = Form(None),
    files: List[UploadFile] = File([]),
    db: Session = Depends(get_db)
):
    try:
        claim = Claim(
            policy_id=policy_id,
            user_id=1,  # TODO: replace with actual logged-in user
            claim_amount=claim_amount,
            description=description,
            status=ClaimStatus.pending  # ✅ FIXED
        )

        db.add(claim)
        db.flush()

        # Generate claim number
        claim.claim_number = f"CLM-{datetime.utcnow().year}-{claim.id:05d}"

        # File handling (basic)
        for file in files:
            print("Uploaded:", file.filename)

        db.commit()
        db.refresh(claim)

        return {
            "id": claim.id,
            "claim_number": claim.claim_number,
            "status": map_status(claim.status.value if hasattr(claim.status, "value") else claim.status)
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ GET ALL CLAIMS
@router.get("/")
def get_claims(
    status: str = None,
    search: str = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Claim).options(
            joinedload(Claim.policy),
            joinedload(Claim.adjuster)  # safe if relationship exists
        )

        # FILTER
        if status:
            status = status.lower()
            if status == "in_review":
                status = "pending"
            query = query.filter(Claim.status == status)

        # SEARCH
        if search:
            query = query.filter(
                or_(
                    Claim.claim_number.ilike(f"%{search}%"),
                    Claim.description.ilike(f"%{search}%")
                )
            )

        # PAGINATION
        offset = (page - 1) * limit
        claims = query.offset(offset).limit(limit).all()

        return [
            {
                "id": c.id,
                "claim_number": c.claim_number,
                "claim_amount": float(c.claim_amount),
                "status": map_status(c.status.value if hasattr(c.status, "value") else c.status),
                "submitted_at": c.submitted_at,
                "processed_at": c.processed_at,
                "description": c.description,
                "policy": {
                    "policy_number": c.policy.policy_number if c.policy else None,
                    "policy_type": c.policy.policy_type if c.policy else None,
                }
            }
            for c in claims
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))