from .models.policy_create import CreatePolicyRequest
from .models.policy_details import PolicyDetails
from .models.policy_item import PolicyItem
from .models.policy_stats import PolicyStatsData
from .models.policy_update import UpdatePolicyRequest
from src.database.manage_policies import (
    create_manage_policy_snapshot,
    delete_manage_policy_snapshot,
    get_manage_policy_snapshot,
    get_manage_policy_stats_snapshot,
    list_manage_policy_snapshots,
    update_manage_policy_snapshot,
)


def get_policy_stats() -> PolicyStatsData:
    stats = get_manage_policy_stats_snapshot()
    return PolicyStatsData(**stats)


def get_policies() -> list[PolicyItem]:
    policies = list_manage_policy_snapshots()
    return [PolicyItem(**policy) for policy in policies]


def get_policy_by_id(policy_id: int) -> PolicyDetails:
    policy = get_manage_policy_snapshot(policy_id)
    return PolicyDetails(**policy)


def create_policy(data: CreatePolicyRequest) -> PolicyDetails:
    policy = create_manage_policy_snapshot(data)
    return PolicyDetails(**policy)


def update_policy(policy_id: int, data: UpdatePolicyRequest) -> PolicyDetails:
    policy = update_manage_policy_snapshot(policy_id, data)
    return PolicyDetails(**policy)


def delete_policy(policy_id: int) -> None:
    delete_manage_policy_snapshot(policy_id)