from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone

from sqlalchemy import select

from src.database.core import SessionLocal
from src.database.models.claims import Claim, ClaimStatus


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


def get_claims_trends_snapshot() -> list[dict[str, int | str]]:
    now = datetime.now(timezone.utc)
    month_starts = _month_starts_for_last_three(now)
    start_window = month_starts[0]

    with SessionLocal() as session:
        stmt = (
            select(Claim.submitted_at, Claim.status)
            .where(Claim.submitted_at >= start_window)
            .order_by(Claim.submitted_at.asc())
        )
        rows = session.execute(stmt).all()

    counts: dict[tuple[int, int], dict[str, int]] = defaultdict(
        lambda: {"approved": 0, "rejected": 0, "fraudulent": 0}
    )

    for submitted_at, status in rows:
        key = (submitted_at.year, submitted_at.month)
        if status == ClaimStatus.APPROVED:
            counts[key]["approved"] += 1
        elif status == ClaimStatus.REJECTED:
            counts[key]["rejected"] += 1
        elif status == ClaimStatus.FRAUDULENT:
            counts[key]["fraudulent"] += 1

    result: list[dict[str, int | str]] = []
    for month_start in month_starts:
        key = (month_start.year, month_start.month)
        month_counts = counts[key]
        result.append(
            {
                "month": month_start.strftime("%b"),
                "approved": month_counts["approved"],
                "rejected": month_counts["rejected"],
                "fraudulent": month_counts["fraudulent"],
            }
        )

    return result
