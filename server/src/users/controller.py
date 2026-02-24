from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db  # Imports the session generator from your database config
from . import service        # Imports the functions from your service.py

# Initialize the API Router for user-related endpoints
router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/dashboard/summary/{user_id}")
def read_dashboard_summary(user_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to fetch all dashboard data for a specific user.
    """
    try:
        # Calls the logic from service.py
        data = service.get_dashboard_summary(db, user_id=user_id)
        
        if not data:
            raise HTTPException(status_code=404, detail="User dashboard data not found")
            
        return data
    except Exception as e:
        # Standard error handling for the API
        raise HTTPException(status_code=500, detail=str(e))