from __future__ import annotations

from typing import Any

from sqlalchemy import select

from src.database.core import SessionLocal
from src.database.manage_policies.repository.mappings import build_snapshot
from src.database.manage_policies.models.policy_profiles import PolicyProfile
from src.database.admin_dashboard.models.policies import Policy
from src.database.admin_dashboard.models.users import User


def list_manage_policy_snapshots() -> list[dict[str, Any]]:
    with SessionLocal() as session:
        stmt = (
            select(Policy, PolicyProfile, User.full_name)
            .outerjoin(PolicyProfile, PolicyProfile.policy_id == Policy.id)
            .outerjoin(User, User.id == Policy.user_id)
            .order_by(Policy.id.asc())
        )
        rows = session.execute(stmt).all()

    return [
        build_snapshot(policy, profile, user_full_name)
        for policy, profile, user_full_name in rows
    ]


def get_manage_policy_snapshot(policy_id: int) -> dict[str, Any]:
    with SessionLocal() as session:
        stmt = (
            select(Policy, PolicyProfile, User.full_name)
            .outerjoin(PolicyProfile, PolicyProfile.policy_id == Policy.id)
            .outerjoin(User, User.id == Policy.user_id)
            .where(Policy.id == policy_id)
        )
        row = session.execute(stmt).one_or_none()

    if row is None:
        raise LookupError(f"Policy with id={policy_id} was not found.")

    policy, profile, user_full_name = row
    return build_snapshot(policy, profile, user_full_name)
