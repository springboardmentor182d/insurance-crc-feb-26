from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, database


router = APIRouter(
    prefix="/api/recommendations",
    tags=["recommendations"]
)

@router.get("")
def get_insurance_deals(db: Session = Depends(database.get_db)):
    try:
        deals = db.query(models.Recommendation).all()
        return deals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))