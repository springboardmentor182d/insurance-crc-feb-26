from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel


# ── Enums (string constants, avoids a hard enum dep) ──────────────────────────
PRIORITY_HIGH = "high"
PRIORITY_MEDIUM = "medium"
PRIORITY_LOW = "low"

CATEGORY_ADDITIONAL = "additional_coverage"
CATEGORY_HIGH_PRIORITY = "high_priority"
CATEGORY_COST_SAVINGS = "cost_savings"
CATEGORY_UPGRADES = "coverage_upgrades"


# ── Request / Filter ───────────────────────────────────────────────────────────
class RecommendationFilter(BaseModel):
    """
    Maps to the query-params accepted by GET /recommendations.
    `category` values mirror the tab labels on the frontend:
        all | additional_coverage | high_priority | cost_savings | coverage_upgrades
    """
    category: Optional[str] = None          # tab filter
    policy_type: Optional[str] = None       # HOME | AUTO | LIFE | HEALTH
    max_premium: Optional[Decimal] = None   # future: budget filter


# ── Response ───────────────────────────────────────────────────────────────────
class RecommendationResponse(BaseModel):
    """
    Shape returned to the React frontend for each recommendation card.
    Mirrors PolicyResponse where fields overlap so the frontend can
    reuse the same InsuranceCard component for both catalog & recommendations.
    """
    id: int
    title: str                      # card headline, e.g. "Health Insurance Coverage Gap"
    policy: str                     # plan name,   e.g. "Family Health Plan"
    provider: str                   # insurer name
    premium: str                    # human-readable, e.g. "$3,600/year"
    coverage: str                   # human-readable, e.g. "$2,000,000"
    match: str                      # e.g. "95%"
    priority: str                   # high | medium | low
    category: str                   # additional_coverage | high_priority | cost_savings | coverage_upgrades
    benefits: List[str]

    # raw numeric fields (useful for sorting / filtering on the client)
    premium_annual: Optional[Decimal] = None
    coverage_amount: Optional[Decimal] = None

    class Config:
        from_attributes = True


class RecommendationListResponse(BaseModel):
    recommendations: List[RecommendationResponse]
    total: int