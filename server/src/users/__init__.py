from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from src.auth.service import decode_access_token
from src.database.core import get_db

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> dict:
    payload = decode_access_token(credentials.credentials)
    result  = await db.execute(
        text("SELECT id, name, email, role FROM users WHERE id = :id"),
        {"id": int(payload["sub"])}
    )
    user = result.fetchone()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}


async def require_admin(
    current_user: dict = Depends(get_current_user)
) -> dict:
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user