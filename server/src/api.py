from fastapi import APIRouter
from pydantic import BaseModel
from src.recommendation_engine import analyze_policies

router = APIRouter()

class UserProfile(BaseModel):
    age: int
    budget: int

@router.post("/recommend")
def recommend(profile: UserProfile):
    return analyze_policies(profile.age, profile.budget)