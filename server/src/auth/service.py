from datetime import datetime, timedelta
import os
from pathlib import Path
from typing import Optional
import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import HTTPException, status
from dotenv import load_dotenv
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from src.auth.oauth_models import OAuthAccount
from src.auth.db_models import AuthCredential
from src.auth.jwt import create_access_token, verify_token
from src.auth.models import (
    AdminLogin,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    GoogleAuthRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from src.auth.security import (
    create_password_reset_token,
    hash_password,
    hash_reset_token,
    verify_password,
)
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
PASSWORD_RESET_EXPIRE_MINUTES = int(os.getenv("PASSWORD_RESET_EXPIRE_MINUTES", "30"))
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()


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
        print("Incoming DOB:", data.date_of_birth)

        user = User(
            email=data.email,
            first_name=first_name or None,
            last_name=last_name,
            full_name=full_name,
            role=UserRole.CUSTOMER,
            date_of_birth=data.date_of_birth ,
            
        )
        self.db.add(user)
        self.db.flush()
        self._set_password(user.id, data.password)
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

        credentials = self._get_credentials(user.id)
        if not credentials or not verify_password(data.password, credentials.password_hash):
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

        credentials = self._get_credentials(user.id)
        if not credentials or not verify_password(data.password, credentials.password_hash):
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

    def forgot_password(self, data: ForgotPasswordRequest) -> ForgotPasswordResponse:
        user = self.db.query(User).filter(User.email == data.email).first()
        if user:
            credentials = self._get_credentials(user.id)
            if credentials:
                raw_token = create_password_reset_token()
                credentials.password_reset_token_hash = hash_reset_token(raw_token)
                credentials.password_reset_requested_at = datetime.utcnow()
                credentials.password_reset_expires_at = datetime.utcnow() + timedelta(
                    minutes=PASSWORD_RESET_EXPIRE_MINUTES
                )
                self.db.commit()

        return ForgotPasswordResponse(
            message="If an account with that email exists, password reset instructions have been sent.",
            email=data.email,
        )

    def google_auth(self, data: GoogleAuthRequest) -> TokenResponse:
        profile = self._fetch_google_profile(data.access_token)
        google_subject = profile["sub"]
        email = profile["email"].lower()
        name = profile.get("name") or email

        oauth_account = (
            self.db.query(OAuthAccount)
            .filter(
                OAuthAccount.provider == "google",
                OAuthAccount.provider_subject == google_subject,
            )
            .first()
        )

        if oauth_account:
            user = self.db.query(User).filter(User.id == oauth_account.user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Linked Google account is invalid",
                )
            return self._make_tokens(user)

        user = self.db.query(User).filter(User.email == email).first()
        if user is None:
            first_name, _, remaining = name.strip().partition(" ")
            user = User(
                email=email,
                first_name=first_name or None,
                last_name=remaining.strip() or None,
                full_name=name.strip() or email,
                role=UserRole.CUSTOMER,
                is_active=True,
            )
            self.db.add(user)
            self.db.flush()

        oauth_account = OAuthAccount(
            user_id=user.id,
            provider="google",
            provider_subject=google_subject,
            email=email,
        )
        self.db.add(oauth_account)
        self.db.commit()
        self.db.refresh(user)
        return self._make_tokens(user)

    def reset_password(self, data: ResetPasswordRequest) -> MessageResponse:
        token_hash = hash_reset_token(data.token)
        credentials = (
            self.db.query(AuthCredential)
            .filter(AuthCredential.password_reset_token_hash == token_hash)
            .first()
        )
        if not credentials or not credentials.password_reset_expires_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password reset link",
            )

        if credentials.password_reset_expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password reset link",
            )

        credentials.password_hash = hash_password(data.password)
        credentials.password_reset_token_hash = None
        credentials.password_reset_expires_at = None
        credentials.password_reset_requested_at = None
        self.db.commit()

        return MessageResponse(message="Password reset successful")

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

    def _get_credentials(self, user_id: int) -> AuthCredential | None:
        return self.db.query(AuthCredential).filter(AuthCredential.user_id == user_id).first()

    def _set_password(self, user_id: int, password: str) -> AuthCredential:
        credentials = self._get_credentials(user_id)
        if credentials is None:
            credentials = AuthCredential(
                user_id=user_id,
                password_hash=hash_password(password),
            )
            self.db.add(credentials)
            self.db.flush()
            return credentials

        credentials.password_hash = hash_password(password)
        return credentials

    def _fetch_google_profile(self, access_token: str) -> dict:
        try:
            token_info_url = "https://oauth2.googleapis.com/tokeninfo?" + urlencode(
                {"access_token": access_token}
            )
            with urlopen(token_info_url, timeout=10) as response:
                token_info = json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, ValueError) as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to verify Google sign-in",
            ) from exc

        audience = token_info.get("aud")
        if GOOGLE_CLIENT_ID and audience != GOOGLE_CLIENT_ID:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google token was issued for a different client",
            )

        if token_info.get("email_verified") not in {"true", True}:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google email is not verified",
            )

        try:
            request = Request(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            with urlopen(request, timeout=10) as response:
                profile = json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, ValueError) as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to fetch Google profile",
            ) from exc

        if not profile.get("email") or not profile.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incomplete Google profile",
            )

        return profile
