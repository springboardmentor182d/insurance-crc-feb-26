import asyncio
from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import HTTPException, Request, status

_request_counts: dict[str, list[datetime]] = defaultdict(list)
_lock = asyncio.Lock()


async def rate_limit(
    request: Request,
    max_requests: int = 10,
    window_seconds: int = 60,
) -> None:
    client_ip = request.client.host if request.client else "unknown"
    now = datetime.utcnow()
    window_start = now - timedelta(seconds=window_seconds)

    async with _lock:
        _request_counts[client_ip] = [
            ts for ts in _request_counts[client_ip] if ts > window_start
        ]
        if len(_request_counts[client_ip]) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many requests. Max {max_requests} per {window_seconds}s.",
            )
        _request_counts[client_ip].append(now)