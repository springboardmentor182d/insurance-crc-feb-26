from datetime import datetime, timedelta
import os
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, status
from dotenv import load_dotenv
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from src.auth.jwt import create_access_token, verify_token
from src.auth.models import AdminLogin, LoginRequest, RegisterRequest, TokenResponse
from src.database.admin_dashboard.models.users import User, UserRole

# Load .env from project root
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

REFRESH_SECRET_KEY = os.getenv(
    "JWT_REFRESH_SECRET_KEY", "your-refresh-secret-key-change-this-in-production"
)
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
REFRESH_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_EXPIRE_DAYS", "7"))
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "bimaverse-admin-2026")


def _role_as_frontend_value(role: object) -> str:
    value = getattr(role, "value", str(role)).lower()
    if value == "customer":
        return "user"
    return value


def _user_name(user: User) -> str:
    if getattr(user, "full_name", None):
        return user.full_name

    first_name = (getattr(user, "first_name", "") or "").strip()
    last_name = (getattr(user, "last_name", "") or "").strip()
    combined = " ".join(part for part in [first_name, last_name] if part)
    return combined or user.email


def create_refresh_token(data: dict) -> str:
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(days=REFRESH_EXPIRE_DAYS),
        "type": "refresh",
    }
    return jwt.encode(payload, REFRESH_SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return payload


def decode_refresh_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token type",
            )
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        ) from exc


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, data: RegisterRequest) -> TokenResponse:
        exists = self.db.query(User).filter(User.email == data.email).first()
        if exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        full_name = data.name.strip()
        first_name, _, remaining = full_name.partition(" ")
        last_name = remaining.strip() or None

        user = User(
            email=data.email,
            first_name=first_name or None,
            last_name=last_name,
            full_name=full_name,
            role=UserRole.CUSTOMER,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return self._make_tokens(user)

    def login(self, data: LoginRequest) -> TokenResponse:
        user = self.db.query(User).filter(User.email == data.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if _role_as_frontend_value(user.role) == "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please use the admin login portal",
            )

        return self._make_tokens(user)

    def admin_login(self, data: AdminLogin) -> TokenResponse:
        if data.admin_secret != ADMIN_SECRET:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid admin secret key",
            )

        user = self.db.query(User).filter(User.email == data.email).first()
        if not user or _role_as_frontend_value(user.role) != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials",
            )

        return self._make_tokens(user, admin=True)

    def refresh(self, refresh_token: str) -> TokenResponse:
        payload = decode_refresh_token(refresh_token)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token payload",
            )

        user = self.db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        return self._make_tokens(user)

    def _make_tokens(self, user: User, admin: bool = False) -> TokenResponse:
        user_role = _role_as_frontend_value(user.role)
        token_payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user_role,
        }

        access_expiry: Optional[timedelta] = timedelta(hours=8) if admin else None
        access_token = create_access_token(token_payload, access_expiry)
        refresh_token = create_refresh_token(token_payload)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user={
                "id": user.id,
                "name": _user_name(user),
                "email": user.email,
                "role": user_role,
            },
        )
