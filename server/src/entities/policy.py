from pydantic import BaseModel
from typing import List

class Policy(BaseModel):
    id: int
    category: str
    title: str
    provider: str
    coverage: int
    premium: int
    claim_ratio: float
    features: List[str]