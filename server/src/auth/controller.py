import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from .service import create_access_token, create_refresh_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
def login(data: LoginRequest):
    auth_email = os.getenv("AUTH_EMAIL")
    auth_password = os.getenv("AUTH_PASSWORD")
    auth_password_hash = os.getenv("AUTH_PASSWORD_HASH")

    if not auth_email or (not auth_password and not auth_password_hash):
        raise HTTPException(
            status_code=503,
            detail="Auth credentials are not configured on server",
        )

    if data.email != auth_email:
        raise HTTPException(status_code=400, detail="User not found")

    if auth_password_hash:
        is_valid = verify_password(data.password, auth_password_hash)
    else:
        is_valid = data.password == auth_password

    if not is_valid:
        raise HTTPException(status_code=400, detail="Wrong password")

    access = create_access_token({"sub": data.email})
    refresh = create_refresh_token({"sub": data.email})

    return {
        "access_token": access,
        "refresh_token": refresh
    }
