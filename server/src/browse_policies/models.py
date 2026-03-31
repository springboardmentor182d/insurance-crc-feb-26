from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel


class PolicyBase(BaseModel):
    name: str
    insurer_name: str
    category: str  # HOME, AUTO, LIFE, HEALTH
    premium_annual: Decimal
    coverage_amount: Decimal
    deductible_amount: Optional[Decimal] = None
    average_rating: Optional[Decimal] = None
    rating_count: Optional[int] = None
    tagline: Optional[str] = None
    key_features: Optional[List[str]] = None


class PolicyResponse(PolicyBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PolicyFilter(BaseModel):
    search: Optional[str] = None
    category: Optional[str] = None
