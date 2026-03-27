from pydantic import BaseModel
from typing import List, Optional


class InsurancePlan(BaseModel):
    """Insurance plan model"""
    id: int
    name: str
    price: float
    coverage: float
    deductible: float
    description: str
    features: List[str]

class RecommendationRequest(BaseModel):
    """Model for insurance recommendation request"""
    age: int
    budget: float

class PlansResponse(BaseModel):
    """Response model for insurance plans"""
    plans: List[InsurancePlan]
