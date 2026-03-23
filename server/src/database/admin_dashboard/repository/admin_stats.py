from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select

from src.database.core import SessionLocal
from src.database.admin_dashboard.models.claims import Claim, ClaimStatus
from src.database.admin_dashboard.models.policies import Policy, PolicyStatus
from src.database.admin_dashboard.models.users import User


def _growth_percentage(current_value: int, previous_value: int) -> float:
    if previous_value == 0:
        return 100.0 if current_value > 0 else 0.0
    return round(((current_value - previous_value) / previous_value) * 100, 2)


def _count_rows_in_range(
    session, model, date_column, start_dt: datetime, end_dt: datetime
) -> int:
    stmt = (
        select(func.count())
        .select_from(model)
        .where(date_column >= start_dt, date_column < end_dt)
    )
    return int(session.execute(stmt).scalar_one())


def get_admin_stats_snapshot() -> dict[str, float | int]:
    now = datetime.now(timezone.utc)
    current_start = now - timedelta(days=30)
    previous_start = now - timedelta(days=60)

    with SessionLocal() as session:
        total_users = int(
            session.execute(select(func.count()).select_from(User)).scalar_one()
        )

        active_policies_stmt = (
            select(func.count())
            .select_from(Policy)
            .where(Policy.status == PolicyStatus.ACTIVE)
        )
        active_policies = int(session.execute(active_policies_stmt).scalar_one())

        total_claims = int(
            session.execute(select(func.count()).select_from(Claim)).scalar_one()
        )

        fraudulent_claims_stmt = (
            select(func.count())
            .select_from(Claim)
            .where(Claim.status == ClaimStatus.FRAUDULENT)
        )
        fraudulent_claims = int(session.execute(fraudulent_claims_stmt).scalar_one())

        users_current = _count_rows_in_range(
            session, User, User.created_at, current_start, now
        )
        users_previous = _count_rows_in_range(
            session, User, User.created_at, previous_start, current_start
        )

        policies_current_stmt = (
            select(func.count())
            .select_from(Policy)
            .where(
                Policy.status == PolicyStatus.ACTIVE,
                Policy.created_at >= current_start,
                Policy.created_at < now,
            )
        )
        policies_previous_stmt = (
            select(func.count())
            .select_from(Policy)
            .where(
                Policy.status == PolicyStatus.ACTIVE,
                Policy.created_at >= previous_start,
                Policy.created_at < current_start,
            )
        )
        policies_current = int(session.execute(policies_current_stmt).scalar_one())
        policies_previous = int(session.execute(policies_previous_stmt).scalar_one())

        claims_current = _count_rows_in_range(
            session, Claim, Claim.submitted_at, current_start, now
        )
        claims_previous = _count_rows_in_range(
            session, Claim, Claim.submitted_at, previous_start, current_start
        )

        fraud_current_stmt = (
            select(func.count())
            .select_from(Claim)
            .where(
                Claim.status == ClaimStatus.FRAUDULENT,
                Claim.submitted_at >= current_start,
                Claim.submitted_at < now,
            )
        )
        fraud_previous_stmt = (
            select(func.count())
            .select_from(Claim)
            .where(
                Claim.status == ClaimStatus.FRAUDULENT,
                Claim.submitted_at >= previous_start,
                Claim.submitted_at < current_start,
            )
        )
        fraud_current = int(session.execute(fraud_current_stmt).scalar_one())
        fraud_previous = int(session.execute(fraud_previous_stmt).scalar_one())

    return {
        "totalUsers": total_users,
        "usersGrowth": _growth_percentage(users_current, users_previous),
        "activePolicies": active_policies,
        "policiesGrowth": _growth_percentage(policies_current, policies_previous),
        "totalClaims": total_claims,
        "claimsGrowth": _growth_percentage(claims_current, claims_previous),
        "fraudDetected": fraudulent_claims,
        "fraudGrowth": _growth_percentage(fraud_current, fraud_previous),
    }
