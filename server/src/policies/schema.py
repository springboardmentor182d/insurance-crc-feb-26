from pydantic import BaseModel
from typing import List

class Policy(BaseModel):
    name: str
    company: str
    price: int
    coverage: str   
    rating: float
    category: str
    deductible: int
    benefits: List[str] 