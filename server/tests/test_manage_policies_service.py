from __future__ import annotations

import pytest

from src.admin.manage_policies.models.policy_create import CreatePolicyRequest
from src.admin.manage_policies.models.policy_update import UpdatePolicyRequest
from src.admin.manage_policies.service import (
    create_policy,
    delete_policy,
    get_policies,
    get_policy_by_id,
    get_policy_stats,
    update_policy,
)

POLICY_KEYS = {
    "id",
    "policyName",
    "provider",
    "type",
    "premium",
    "coverage",
    "deductible",
    "description",
    "status",
}


def test_policy_stats_response_shape(seeded_db) -> None:
    payload = get_policy_stats().model_dump()

    assert set(payload.keys()) == {
        "totalPolicies",
        "activePolicies",
        "autoInsurance",
        "homeInsurance",
    }
    assert payload["totalPolicies"] >= 1
    assert 0 <= payload["activePolicies"] <= payload["totalPolicies"]


def test_policies_list_response_shape(seeded_db) -> None:
    policies = [policy.model_dump() for policy in get_policies()]

    assert len(policies) >= 1
    for policy in policies:
        assert set(policy.keys()) == POLICY_KEYS


def test_get_policy_by_id_response_shape(seeded_db) -> None:
    first_policy = get_policies()[0]
    payload = get_policy_by_id(first_policy.id).model_dump()

    assert set(payload.keys()) == POLICY_KEYS
    assert payload["id"] == first_policy.id


def test_manage_policy_crud_flow(seeded_db) -> None:
    create_request = CreatePolicyRequest(
        policyName="Pytest Policy",
        provider="Pytest Provider",
        type="Health",
        premium=2500.0,
        coverage=450000.0,
        deductible=1500.0,
        description="Created by integration test.",
    )

    created = create_policy(create_request).model_dump()
    policy_id = created["id"]

    try:
        assert created["policyName"] == create_request.policyName
        assert created["provider"] == create_request.provider
        assert created["status"] == "active"

        update_request = UpdatePolicyRequest(
            policyName="Pytest Policy Updated",
            provider="Pytest Provider Updated",
            type="Life",
            premium=3000.0,
            coverage=550000.0,
            deductible=2000.0,
            description="Updated by integration test.",
            status="inactive",
        )
        updated = update_policy(policy_id, update_request).model_dump()

        assert updated["policyName"] == update_request.policyName
        assert updated["provider"] == update_request.provider
        assert updated["type"] == "Life"
        assert updated["status"] == "inactive"
        assert updated["description"] == update_request.description

        fetched = get_policy_by_id(policy_id).model_dump()
        assert fetched["id"] == policy_id
        assert fetched["status"] == "inactive"

        delete_policy(policy_id)
        with pytest.raises(LookupError):
            get_policy_by_id(policy_id)
    finally:
        try:
            delete_policy(policy_id)
        except LookupError:
            pass
