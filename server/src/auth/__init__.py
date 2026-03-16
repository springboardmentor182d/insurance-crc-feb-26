from fastapi import Depends, HTTPException, status

from src.auth.jwt import get_current_user, get_current_user_id
from src.auth.service import decode_access_token


def require_admin(current_user=Depends(get_current_user)):
    role_value = getattr(current_user.role, "value", str(current_user.role)).lower()
    if role_value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


__all__ = [
    "decode_access_token",
    "get_current_user",
    "get_current_user_id",
    "require_admin",
]