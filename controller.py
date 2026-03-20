# Recommendation controller - handles HTTP requests for insurance recommendations
from fastapi import APIRouter
from models.insurance import RecommendationRequest
from modules.recommendation.service import get_recommendation

# Create a router for recommendation endpoints
router = APIRouter(prefix="/insurance", tags=["recommendation"])

@router.post("/recommend")
async def recommend(request: RecommendationRequest):
    """
    Get insurance recommendation based on user's age and budget
    
    Args:
        request: Request with age and budget
        
    Returns:
        Recommended insurance plan
    """
    recommendation = get_recommendation(request.age, request.budget)
    return {"recommendation": recommendation}
