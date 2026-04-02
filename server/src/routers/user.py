from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.models import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"error": "User not found"}

    return {
    "name": user.name,
    "email": user.email,
    "dob": user.dob,
    "income": user.income,
    "risk_level": user.risk_level,
    "insurance_type": user.insurance_type,
    "recommended_plan": user.recommended_plan,
    "coverage": user.coverage 
}