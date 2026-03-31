from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class ActivePolicyBase(BaseModel):
    user_id: int
    policy_id: Optional[int] = None
    policy_number: str
    status: str
    category: str
    insurer_name: str
    product_name: str
    premium_annual: Decimal
    coverage_amount: Decimal
    deductible_amount: Optional[Decimal] = None
    start_date: date
    end_date: date
    tags: Optional[str] = None
    warning_text: Optional[str] = None


class ActivePolicyResponse(ActivePolicyBase):
    id: int
    is_expiring_soon: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ActivePoliciesSummary(BaseModel):
    active_count: int
    expiring_soon_count: int
    total_coverage: Decimal
    annual_premium: Decimal
