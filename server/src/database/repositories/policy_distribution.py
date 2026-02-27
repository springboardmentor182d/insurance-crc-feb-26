from __future__ import annotations

from sqlalchemy import func, select

from src.database.core import SessionLocal
from src.database.models.policies import Policy


def _to_title_case(value: str) -> str:
    return value.replace("_", " ").title()


def get_policy_distribution_snapshot() -> list[dict[str, float | int | str]]:
    with SessionLocal() as session:
        rows = session.execute(
            select(Policy.policy_type, func.count(Policy.id))
            .group_by(Policy.policy_type)
            .order_by(func.count(Policy.id).desc())
        ).all()

    total = sum(int(count) for _, count in rows)
    if total == 0:
        return []

    result: list[dict[str, float | int | str]] = []
    for policy_type, count in rows:
        item_count = int(count)
        percentage = round((item_count / total) * 100, 2)
        result.append(
            {
                "policyType": _to_title_case(policy_type.value),
                "percentage": percentage,
                "count": item_count,
            }
        )

    return result
