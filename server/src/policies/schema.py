from pydantic import BaseModel
from typing import List

class Policy(BaseModel):
    name: str
    company: str
    price: int
    coverage: int
    deductible: int
    rating: float
    benefits: List[str]
    category: str


class CompareRequest(BaseModel):
    ids: List[int]