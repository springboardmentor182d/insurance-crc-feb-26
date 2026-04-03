from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from src.database import get_db
from src.models import User

router = APIRouter(prefix="/preferences", tags=["Preferences"])


# ✅ SCHEMA
class PreferenceRequest(BaseModel):
    income: int
    risk_level: str
    insurance_type: str


@router.post("/save/{user_id}")
@router.post("/save/{user_id}")
def save_preferences(user_id: int, data: PreferenceRequest, db: Session = Depends(get_db)):

    print("🔥 SAVE API CALLED", data.dict())   # ADD THIS

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.income = data.income
    user.risk_level = data.risk_level
    user.insurance_type = data.insurance_type

    db.commit()

    return {"message": "Preferences saved successfully"}
