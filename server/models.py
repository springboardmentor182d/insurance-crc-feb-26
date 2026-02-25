from pydantic import BaseModel
from typing import List, Optional


class UserProfile(BaseModel):
    name: str
    age: int
    occupation: str
    location: str
    annual_income: float
    current_coverage: List[str]


class Policy(BaseModel):
    id: int
    category: str
    name: str
    provider: str
    premium: float
    coverage: str
    description: str


class Recommendation(BaseModel):
    match_score: float
    category: str
    title: str
    description: str
    policy: Policy
    reasons: List[str]  