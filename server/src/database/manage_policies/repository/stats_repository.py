from __future__ import annotations

from sqlalchemy import func, select

from src.database.core import SessionLocal
from src.database.admin_dashboard.models.policies import (
    Policy,
    PolicyStatus,
    PolicyType,
)


def get_manage_policy_stats_snapshot() -> dict[str, int]:
    with SessionLocal() as session:
        total_policies = int(
            session.execute(select(func.count()).select_from(Policy)).scalar_one()
        )
        active_policies = int(
            session.execute(
                select(func.count())
                .select_from(Policy)
                .where(Policy.status == PolicyStatus.ACTIVE)
            ).scalar_one()
        )
        auto_insurance = int(
            session.execute(
                select(func.count())
                .select_from(Policy)
                .where(Policy.policy_type == PolicyType.AUTO)
            ).scalar_one()
        )
        home_insurance = int(
            session.execute(
                select(func.count())
                .select_from(Policy)
                .where(Policy.policy_type == PolicyType.HOME)
            ).scalar_one()
        )

    return {
        "totalPolicies": total_policies,
        "activePolicies": active_policies,
        "autoInsurance": auto_insurance,
        "homeInsurance": home_insurance,
    }
