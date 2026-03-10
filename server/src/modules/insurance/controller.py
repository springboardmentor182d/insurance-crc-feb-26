# Insurance controller - handles HTTP requests for insurance operations
from fastapi import APIRouter
from modules.insurance.service import get_all_plans
from models.insurance import PlansResponse

# Create a router for insurance endpoints
router = APIRouter(prefix="/insurance", tags=["insurance"])

@router.get("/plans")
async def get_plans():
    """
    Get all available insurance plans
    
    Returns:
        List of all insurance plans
    """
    plans = get_all_plans()
    return {"plans": plans}
