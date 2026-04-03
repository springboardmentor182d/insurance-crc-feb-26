from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass

from sqlalchemy import select

from src.database.core import SessionLocal
from src.database.admin_dashboard.models.adjusters import Adjuster
from src.database.admin_dashboard.models.claims import Claim, ClaimStatus


@dataclass
class _AdjusterAgg:
    name: str
    total_claims: int = 0
    approved_claims: int = 0
    processing_days_total: float = 0.0
    processing_count: int = 0


def get_top_adjusters_snapshot(limit: int = 3) -> list[dict[str, float | int | str]]:
    with SessionLocal() as session:
        rows = session.execute(
            select(
                Adjuster.name,
                Claim.status,
                Claim.submitted_at,
                Claim.processed_at,
            )
            .join(Claim, Claim.adjuster_id == Adjuster.id)
            .where(Claim.adjuster_id.is_not(None))
        ).all()

    agg: dict[str, _AdjusterAgg] = defaultdict(lambda: _AdjusterAgg(name=""))
    for name, status, submitted_at, processed_at in rows:
        if not agg[name].name:
            agg[name].name = name

        item = agg[name]
        item.total_claims += 1
        if status == ClaimStatus.approved:
            item.approved_claims += 1
        if submitted_at is not None and processed_at is not None:
            duration_days = (processed_at - submitted_at).total_seconds() / 86400
            if duration_days >= 0:
                item.processing_days_total += duration_days
                item.processing_count += 1

    ranked = sorted(agg.values(), key=lambda x: x.total_claims, reverse=True)[:limit]

    result: list[dict[str, float | int | str]] = []
    for item in ranked:
        approval_rate = 0.0
        if item.total_claims > 0:
            approval_rate = round((item.approved_claims / item.total_claims) * 100, 2)

        avg_days = 0.0
        if item.processing_count > 0:
            avg_days = round(item.processing_days_total / item.processing_count, 2)

        result.append(
            {
                "name": item.name,
                "totalClaims": item.total_claims,
                "approvalRate": approval_rate,
                "avgProcessingDays": avg_days,
            }
        )

    return result
