from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.entities.active_policy import ActivePolicy
from sqlalchemy.orm import selectinload
from datetime import date
from pydantic import BaseModel
router = APIRouter()


@router.get("/")
def get_pending_policies(db: Session = Depends(get_db)):
   
    policies = db.query(ActivePolicy).options(
    selectinload(ActivePolicy.user)
    ).all()
   

    result = []

    for p in policies:
        user = p.user

        # ✅ calculate age safely
        age = None
        
        if user and user.date_of_birth:
            
            age = date.today().year - user.date_of_birth.year

        result.append({
            "id": p.id,
            "product_name": p.product_name,
            "category": p.category,
            "coverage_amount": p.coverage_amount,
            "premium_annual": p.premium_annual,
            "status": p.status,

            # ✅ SAFE USER DATA
            "user": {
                "id": user.id if user else None,
                "name": user.full_name if user else None,
                "email": user.email if user else None,
                "age": age
            },

            # ✅ ELIGIBILITY
            "is_eligible": check_policy_eligibility(user, p)
        })

    return result

def check_policy_eligibility(user, policy):
    if not user:
        return False

    age = None
    if user.date_of_birth:
        age = date.today().year - user.date_of_birth.year

    if policy.category in ["LIFE", "HEALTH"]:
        return age is not None and age >= 18

    return True

@router.post("/{policy_id}/approve")
def approve_policy(policy_id: int, db: Session = Depends(get_db)):
    policy = db.query(ActivePolicy).get(policy_id)
    policy.status = "ACTIVE"
    db.commit()
    return {"message": "Policy approved"}
class RejectRequest(BaseModel):
    reason: str



@router.post("/{policy_id}/reject")
def reject_policy(policy_id: int, data: RejectRequest, db: Session = Depends(get_db)):
    policy = db.query(ActivePolicy).get(policy_id)
    
    policy.status = "REJECTED"
    policy.rejection_reason = data.reason  # ✅ store reason
    
    db.commit()

    return {"message": "Policy rejected"}
@router.post("/{policy_id}/under-review")
def mark_under_review(policy_id: int, db: Session = Depends(get_db)):
    policy = db.query(ActivePolicy).get(policy_id)

    if not policy:
        return {"error": "Policy not found"}

    policy.status = "UNDER_REVIEW"
    db.commit()

    return {"message": "Policy moved to under review"}