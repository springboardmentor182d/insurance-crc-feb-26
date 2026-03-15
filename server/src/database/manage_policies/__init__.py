from __future__ import annotations

from typing import Any


def list_manage_policy_snapshots() -> list[dict[str, Any]]:
    from src.database.manage_policies.repository import (
        list_manage_policy_snapshots as _fn,
    )

    return _fn()


def get_manage_policy_snapshot(policy_id: int) -> dict[str, Any]:
    from src.database.manage_policies.repository import (
        get_manage_policy_snapshot as _fn,
    )

    return _fn(policy_id)


def get_manage_policy_stats_snapshot() -> dict[str, int]:
    from src.database.manage_policies.repository import (
        get_manage_policy_stats_snapshot as _fn,
    )

    return _fn()


def create_manage_policy_snapshot(data: Any) -> dict[str, Any]:
    from src.database.manage_policies.repository import (
        create_manage_policy_snapshot as _fn,
    )

    return _fn(data)


def update_manage_policy_snapshot(policy_id: int, data: Any) -> dict[str, Any]:
    from src.database.manage_policies.repository import (
        update_manage_policy_snapshot as _fn,
    )

    return _fn(policy_id, data)


def delete_manage_policy_snapshot(policy_id: int) -> None:
    from src.database.manage_policies.repository import (
        delete_manage_policy_snapshot as _fn,
    )

    _fn(policy_id)


__all__ = [
    "create_manage_policy_snapshot",
    "delete_manage_policy_snapshot",
    "get_manage_policy_snapshot",
    "get_manage_policy_stats_snapshot",
    "list_manage_policy_snapshots",
    "update_manage_policy_snapshot",
]
