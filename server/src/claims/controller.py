from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from sqlalchemy import or_, text
from typing import List

from src.auth.jwt import get_current_user_id
from src.database.core import get_db
from src.database.admin_dashboard.models.claims import Claim, ClaimStatus
from src.database.admin_dashboard.models.policies import Policy
from src.entities.active_policy import ActivePolicy

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


def build_admin_message(status, review_notes):
    normalized_status = map_status(status.value if hasattr(status, "value") else status)
    if review_notes:
        return review_notes
    if normalized_status == "APPROVED":
        return "Your claim has been approved by the admin team. The policy has been removed from your active policies."
    if normalized_status == "REJECTED":
        return "Your claim was rejected by the admin team."
    if normalized_status == "PAID":
        return "Your approved claim has been marked as paid."
    return "Your claim is currently under review."


# ✅ CREATE CLAIM
@router.post("/")
def create_claim(
    policy_id: int = Form(...),
    claim_amount: float = Form(...),
    description: str = Form(None),
    files: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    try:
        policy = (
            db.query(Policy)
            .join(
                ActivePolicy,
                ActivePolicy.policy_id == Policy.id,
            )
            .filter(
                Policy.id == policy_id,
                ActivePolicy.user_id == current_user_id,
            )
            .first()
        )
        if not policy:
            raise HTTPException(status_code=404, detail="Policy not found")

        next_claim_id = db.execute(
            text("SELECT nextval(pg_get_serial_sequence('claims', 'id'))")
        ).scalar_one()

        claim = Claim(
            id=next_claim_id,
            claim_number=f"CLM-{datetime.utcnow().year}-{next_claim_id:05d}",
            policy_id=policy_id,
            user_id=current_user_id,
            claim_amount=claim_amount,
            description=description,
            status=ClaimStatus.pending  # ✅ FIXED
        )

        db.add(claim)

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
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


# ✅ GET ALL CLAIMS
@router.get("/")
def get_claims(
    status: str = None,
    search: str = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    try:
        query = db.query(Claim).options(
            joinedload(Claim.policy),
            joinedload(Claim.adjuster)  # safe if relationship exists
        ).filter(Claim.user_id == current_user_id)

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
                "review_notes": c.review_notes,
                "admin_message": build_admin_message(c.status, c.review_notes),
                "policy": {
                    "policy_number": c.policy.policy_number if c.policy else None,
                    "policy_type": (
                        c.policy.policy_type.value
                        if c.policy and hasattr(c.policy.policy_type, "value")
                        else c.policy.policy_type if c.policy else None
                    ),
                }
            }
            for c in claims
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{claim_id}")
def get_claim_detail(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    claim = (
        db.query(Claim)
        .options(
            joinedload(Claim.policy),
            joinedload(Claim.adjuster),
        )
        .filter(Claim.id == claim_id, Claim.user_id == current_user_id)
        .first()
    )

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    policy_type = None
    if claim.policy:
        policy_type = (
            claim.policy.policy_type.value
            if hasattr(claim.policy.policy_type, "value")
            else claim.policy.policy_type
        )

    return {
        "id": claim.id,
        "claim_number": claim.claim_number,
        "claim_amount": float(claim.claim_amount),
        "status": map_status(claim.status.value if hasattr(claim.status, "value") else claim.status),
        "submitted_at": claim.submitted_at,
        "processed_at": claim.processed_at,
        "description": claim.description,
        "review_notes": claim.review_notes,
        "admin_message": build_admin_message(claim.status, claim.review_notes),
        "policy_number": claim.policy.policy_number if claim.policy else None,
        "policy_type": policy_type,
        "deductible": None,
        "incident_date": claim.submitted_at,
        "location": None,
        "report_number": None,
        "documents": [],
        "adjuster": (
            {
                "name": claim.adjuster.name,
                "email": claim.adjuster.email,
                "phone": None,
            }
            if claim.adjuster
            else None
        ),
        "fraud_score": int(round((claim.fraud_score or 0.0) * 100)),
        "fraud_message": (
            "Flagged for additional review"
            if claim.fraud_score and claim.fraud_score > 0
            else "No fraud indicators"
        ),
    }
