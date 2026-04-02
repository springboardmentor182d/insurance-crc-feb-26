from sqlalchemy.orm import Session
from datetime import datetime

from src.database.admin_dashboard.models.claims import Claim


# 🔹 CREATE CLAIM
def create_claim(db: Session, user_id: int, payload):
    claim = Claim(
        policy_id=payload.policy_id,
        user_id=user_id,
        claim_amount=payload.claim_amount,
        description=payload.description,
        status=ClaimStatus.pending
        submitted_at=datetime.utcnow(),
    )

    db.add(claim)
    db.flush()

    # Generate Claim Number
    claim.claim_number = f"CLM-{datetime.utcnow().year}-{claim.id:05d}"

    db.commit()
    db.refresh(claim)

    return claim


# 🔹 GET ALL CLAIMS (Claims.js)
def get_claims(db: Session, user_id: int):
    return db.query(Claim).filter(Claim.user_id == user_id).all()


# 🔹 GET SINGLE CLAIM (ClaimDetails.js)
def get_claim(db: Session, user_id: int, claim_id: int):
    return db.query(Claim).filter(
        Claim.id == claim_id,
        Claim.user_id == user_id
    ).first()