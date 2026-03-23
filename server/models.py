from pydantic import BaseModel
from typing import List


class InsuranceRecommendation(BaseModel):
    title: str
    policy: str
    provider: str
    premium: str
    coverage: str
    match: str
    benefits: List[str]


class RecommendationResponse(BaseModel):
    recommendations: List[InsuranceRecommendation]