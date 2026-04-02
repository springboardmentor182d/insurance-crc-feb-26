from __future__ import annotations
print("✅ revenue.py loaded")
from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal


from sqlalchemy import select

from src.database.core import SessionLocal
from src.database.admin_dashboard.models.claims import Claim, ClaimStatus
from src.database.admin_dashboard.models.policies import Policy


def _month_starts_for_last_three(now: datetime) -> list[datetime]:
    starts: list[datetime] = []
    year = now.year
    month = now.month
    for offset in range(2, -1, -1):
        m = month - offset
        y = year
        while m <= 0:
            m += 12
            y -= 1
        starts.append(datetime(y, m, 1, tzinfo=timezone.utc))
    return starts


def get_revenue_snapshot() -> list[dict[str, float | str]]:
    now = datetime.now(timezone.utc)
    month_starts = _month_starts_for_last_three(now)
    start_window = month_starts[0]

    with SessionLocal() as session:
        premium_rows = session.execute(
            select(Policy.created_at, Policy.premium_amount).where(
                Policy.created_at >= start_window
            )
        ).all()

        expense_rows = session.execute(
            select(Claim.processed_at, Claim.approved_amount).where(
                Claim.status == ClaimStatus.APPROVED,
                Claim.processed_at.is_not(None),
                Claim.approved_amount.is_not(None),
                Claim.processed_at >= start_window,
            )
        ).all()

    revenue_by_month: dict[tuple[int, int], Decimal] = defaultdict(lambda: Decimal("0"))
    for created_at, premium_amount in premium_rows:
        key = (created_at.year, created_at.month)
        revenue_by_month[key] += Decimal(premium_amount or 0)

    expenses_by_month: dict[tuple[int, int], Decimal] = defaultdict(
        lambda: Decimal("0")
    )
    for processed_at, approved_amount in expense_rows:
        key = (processed_at.year, processed_at.month)
        expenses_by_month[key] += Decimal(approved_amount or 0)

    result: list[dict[str, float | str]] = []
    for month_start in month_starts:
        key = (month_start.year, month_start.month)
        result.append(
            {
                "month": month_start.strftime("%b"),
                "revenue": float(revenue_by_month[key]),
                "expenses": float(expenses_by_month[key]),
            }
        )

    return result
