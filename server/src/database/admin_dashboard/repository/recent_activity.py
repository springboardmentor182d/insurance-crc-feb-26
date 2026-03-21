from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import aliased

from src.database.core import SessionLocal
from src.database.admin_dashboard.models.activity_logs import ActivityLog
from src.database.admin_dashboard.models.users import User


def _relative_time(dt: datetime, now: datetime) -> str:
    seconds = int((now - dt).total_seconds())
    if seconds < 60:
        return "just now"
    if seconds < 3600:
        minutes = seconds // 60
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    if seconds < 86400:
        hours = seconds // 3600
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    days = seconds // 86400
    return f"{days} day{'s' if days != 1 else ''} ago"


def get_recent_activity_snapshot(limit: int = 10) -> list[dict[str, str]]:
    user_alias = aliased(User)
    with SessionLocal() as session:
        rows = session.execute(
            select(
                ActivityLog.title,
                ActivityLog.created_at,
                ActivityLog.severity,
                user_alias.full_name,
            )
            .outerjoin(user_alias, user_alias.id == ActivityLog.user_id)
            .order_by(ActivityLog.created_at.desc())
            .limit(limit)
        ).all()

    now = datetime.now(timezone.utc)
    result: list[dict[str, str]] = []
    for title, created_at, severity, actor_name in rows:
        result.append(
            {
                "title": title,
                "actor": actor_name or "System",
                "timestamp": _relative_time(created_at, now),
                "severity": severity.value,
            }
        )

    return result
