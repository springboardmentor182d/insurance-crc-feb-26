from datetime import date, timedelta
from decimal import Decimal
from typing import List

from sqlalchemy.orm import Session

from src.entities.active_policy import ActivePolicy
from src.active_policies.models import ActivePoliciesSummary


EXPIRING_SOON_DAYS = 30


def list_active_policies(db: Session, user_id: int) -> List[ActivePolicy]:
    """
    Return all active policies for the given user.

    A policy is considered active if:
    - status is 'ACTIVE'
    - end_date is today or in the future
    """
    today = date.today()
    return (
        db.query(ActivePolicy)
        .filter(
            ActivePolicy.user_id == user_id,
            ActivePolicy.status == "ACTIVE",
            ActivePolicy.end_date >= today,
        )
        .order_by(ActivePolicy.end_date.asc())
        .all()
    )


def compute_summary(policies: List[ActivePolicy]) -> ActivePoliciesSummary:
    """Aggregate summary metrics for the dashboard cards."""
    today = date.today()
    expiring_threshold = today + timedelta(days=EXPIRING_SOON_DAYS)

    active_count = len(policies)
    expiring_soon_count = 0
    total_coverage = Decimal("0")
    annual_premium = Decimal("0")

    for p in policies:
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
