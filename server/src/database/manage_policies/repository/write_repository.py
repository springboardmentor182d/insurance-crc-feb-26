from __future__ import annotations

from datetime import date, timedelta
from decimal import Decimal
from typing import Any

from sqlalchemy import delete, select

from src.database.core import SessionLocal
from src.database.manage_policies.repository.mappings import (
    generate_policy_number,
    get_default_user_id,
    to_db_status,
    to_policy_type,
)
from src.database.manage_policies.models.policy_profiles import PolicyProfile
from src.database.manage_policies.repository.read_repository import (
    get_manage_policy_snapshot,
)
from src.database.admin_dashboard.models.claims import Claim
from src.database.admin_dashboard.models.policies import Policy, PolicyStatus


def create_manage_policy_snapshot(data: Any) -> dict[str, Any]:
    with SessionLocal() as session:
        policy = Policy(
            user_id=get_default_user_id(session),
            policy_number=generate_policy_number(session),
            policy_type=to_policy_type(data.type),
            status=PolicyStatus.ACTIVE,
            premium_amount=Decimal(str(data.premium)),
            coverage_amount=Decimal(str(data.coverage)),
            start_date=date.today(),
            end_date=date.today() + timedelta(days=365),
        )
        session.add(policy)
        session.flush()

        profile = PolicyProfile(
            policy_id=policy.id,
            policy_name=data.policyName,
            provider=data.provider,
            deductible_amount=Decimal(str(data.deductible)),
            description=data.description or "",
        )
        session.add(profile)
        session.commit()
        policy_id = policy.id

    return get_manage_policy_snapshot(policy_id)


def update_manage_policy_snapshot(policy_id: int, data: Any) -> dict[str, Any]:
    with SessionLocal() as session:
        stmt = (
            select(Policy, PolicyProfile)
            .outerjoin(PolicyProfile, PolicyProfile.policy_id == Policy.id)
            .where(Policy.id == policy_id)
        )
        row = session.execute(stmt).one_or_none()
        if row is None:
            raise LookupError(f"Policy with id={policy_id} was not found.")

        policy, profile = row
        policy.policy_type = to_policy_type(data.type)
        policy.premium_amount = Decimal(str(data.premium))
        policy.coverage_amount = Decimal(str(data.coverage))

        if data.status is not None:
            policy.status = to_db_status(data.status)

        if profile is None:
            profile = PolicyProfile(
                policy_id=policy.id,
                policy_name=data.policyName,
                provider=data.provider,
                deductible_amount=Decimal(str(data.deductible)),
                description=data.description or "",
            )
            session.add(profile)
        else:
            profile.policy_name = data.policyName
            profile.provider = data.provider
            profile.deductible_amount = Decimal(str(data.deductible))
            if data.description is not None:
                profile.description = data.description

        session.commit()

    return get_manage_policy_snapshot(policy_id)


def delete_manage_policy_snapshot(policy_id: int) -> None:
    with SessionLocal() as session:
        policy = session.get(Policy, policy_id)
        if policy is None:
            raise LookupError(f"Policy with id={policy_id} was not found.")

        session.execute(delete(Claim).where(Claim.policy_id == policy_id))
        session.execute(
            delete(PolicyProfile).where(PolicyProfile.policy_id == policy_id)
        )
        session.execute(delete(Policy).where(Policy.id == policy_id))
        session.commit()
