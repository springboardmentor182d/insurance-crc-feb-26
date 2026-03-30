from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.entities.active_policy import ActivePolicy

router = APIRouter()


@router.get("")
def get_pending_policies(db: Session = Depends(get_db)):
    return db.query(ActivePolicy).filter(ActivePolicy.status == "PENDING").all()


@router.post("/{policy_id}/approve")
def approve_policy(policy_id: int, db: Session = Depends(get_db)):
    policy = db.query(ActivePolicy).get(policy_id)
    policy.status = "ACTIVE"
    db.commit()
    return {"message": "Policy approved"}


@router.post("/{policy_id}/reject")
def reject_policy(policy_id: int, db: Session = Depends(get_db)):
    policy = db.query(ActivePolicy).get(policy_id)
    policy.status = "REJECTED"
    db.commit()
    return {"message": "Policy rejected"}