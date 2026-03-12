from pydantic import BaseModel
from typing import List

class Policy(BaseModel):
    name: str
    provider: str
    coverage: str
    premium: str
    features: List[str]
    