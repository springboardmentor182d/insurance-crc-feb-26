from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


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


class PolicyDocumentResponse(BaseModel):
    id: int
    active_policy_id: int
    file_name: str
    content_type: str
    file_size: int
    created_at: datetime

    class Config:
        from_attributes = True


class ActivePolicyResponse(ActivePolicyBase):
    id: int
    is_expiring_soon: bool = False
    documents: list[PolicyDocumentResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ActivePoliciesSummary(BaseModel):
    active_count: int
    expiring_soon_count: int
    total_coverage: Decimal
    annual_premium: Decimal

