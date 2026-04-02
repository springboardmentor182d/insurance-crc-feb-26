from datetime import date, timedelta
from decimal import Decimal
from typing import List

from sqlalchemy.orm import Session, selectinload

from src.entities.active_policy import ActivePolicy
from src.active_policies.models import ActivePoliciesSummary



EXPIRING_SOON_DAYS = 30





def list_active_policies(db: Session, user_id: int):
    return (
        db.query(ActivePolicy)
        .filter(
            ActivePolicy.user_id == user_id,
            
        )
        .all()
    )

def compute_summary(policies: List[ActivePolicy]) -> ActivePoliciesSummary:
    """Aggregate summary metrics for ACTIVE policies only."""
    today = date.today()
    expiring_threshold = today + timedelta(days=EXPIRING_SOON_DAYS)

    active_policies = [p for p in policies if p.status == "ACTIVE"]  # 🔥 FIX

    active_count = len(active_policies)
    expiring_soon_count = 0
    total_coverage = Decimal("0")
    annual_premium = Decimal("0")

    for p in active_policies:
        # Expiring soon
        if p.end_date is not None and today <= p.end_date <= expiring_threshold:
            expiring_soon_count += 1

        # Totals
        if p.coverage_amount is not None:
            total_coverage += Decimal(p.coverage_amount)
        if p.premium_annual is not None:
            annual_premium += Decimal(p.premium_annual)

    return ActivePoliciesSummary(
        active_count=active_count,
        expiring_soon_count=expiring_soon_count,
        total_coverage=total_coverage,
        annual_premium=annual_premium,
    )