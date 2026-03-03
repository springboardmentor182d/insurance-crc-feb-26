from __future__ import annotations

import asyncio

from src.admin.service import (
    get_admin_stats,
    get_claims_trends,
    get_policy_distribution,
    get_recent_activity,
    get_revenue_data,
    get_top_adjusters,
)


def test_admin_stats_response_shape(seeded_db) -> None:
    response = asyncio.run(get_admin_stats())
    payload = response.model_dump()
    data = payload["data"]

    expected_keys = {
        "totalUsers",
        "usersGrowth",
        "activePolicies",
        "policiesGrowth",
        "totalClaims",
        "claimsGrowth",
        "fraudDetected",
        "fraudGrowth",
    }
    assert set(data.keys()) == expected_keys
    assert data["totalUsers"] >= 1
    assert data["activePolicies"] >= 1


def test_claims_trends_response_shape(seeded_db) -> None:
    response = asyncio.run(get_claims_trends())
    payload = response.model_dump()

    assert len(payload["data"]) == 3
    for row in payload["data"]:
        assert set(row.keys()) == {"month", "approved", "rejected", "fraudulent"}


def test_revenue_response_shape(seeded_db) -> None:
    response = asyncio.run(get_revenue_data())
    payload = response.model_dump()

    assert len(payload["data"]) == 3
    for row in payload["data"]:
        assert set(row.keys()) == {"month", "revenue", "expenses"}


def test_policy_distribution_response_shape(seeded_db) -> None:
    response = asyncio.run(get_policy_distribution())
    payload = response.model_dump()

    assert len(payload["data"]) >= 1
    for row in payload["data"]:
        assert set(row.keys()) == {"policyType", "percentage", "count"}


def test_top_adjusters_response_shape(seeded_db) -> None:
    response = asyncio.run(get_top_adjusters())
    payload = response.model_dump()

    assert len(payload["data"]) >= 1
    for row in payload["data"]:
        assert set(row.keys()) == {"name", "totalClaims", "approvalRate", "avgProcessingDays"}


def test_recent_activity_response_shape(seeded_db) -> None:
    response = asyncio.run(get_recent_activity())
    payload = response.model_dump()

    assert len(payload["data"]) >= 1
    for row in payload["data"]:
        assert set(row.keys()) == {"title", "actor", "timestamp", "severity"}
