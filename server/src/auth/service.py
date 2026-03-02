from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from src.auth.models import UserRegister, UserLogin, AdminLogin, TokenResponse  # Aliases work

SECRET_KEY = "your-secret-key-change-in-production"
REFRESH_SECRET_KEY = "your-refresh-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_EXPIRE_MIN = 30
REFRESH_EXPIRE_DAYS = 7
ADMIN_SECRET = "bimaverse-admin-2026"

# ── Helpers ───────────────────────────────────────────────
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    payload = {**data, "exp": datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_EXPIRE_MIN)), "type": "access"}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:
    payload = {**data, "exp": datetime.utcnow() + timedelta(days=REFRESH_EXPIRE_DAYS), "type": "refresh"}
    return jwt.encode(payload, REFRESH_SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def decode_refresh_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ── Service ───────────────────────────────────────────────
class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, data: UserRegister) -> TokenResponse:
        exists = await self.db.execute(
            text("SELECT id FROM users WHERE email = :email"), {"email": data.email}
        )
        if exists.fetchone():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        result = await self.db.execute(
            text("""
                INSERT INTO users (name, email, password, dob, role, created_at)
                VALUES (:name, :email, :password, :dob, 'user', NOW())
                RETURNING id, name, email, role
            """),
            {
                "name": data.name,              # ✅ Fixed: data.name
                "email": data.email,
                "password": hash_password(data.password),
                "dob": data.date_of_birth       # ✅ Fixed: data.date_of_birth
            }
        )
        await self.db.commit()
        return self._make_tokens(result.fetchone())

    async def login(self, data: UserLogin) -> TokenResponse:
        result = await self.db.execute(
            text("SELECT id, name, email, password, role FROM users WHERE email = :email"),
            {"email": data.email}
        )
        user = result.fetchone()
        if not user or not verify_password(data.password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if user.role == "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Please use the admin login portal")
        return self._make_tokens(user)

    async def admin_login(self, data: AdminLogin) -> TokenResponse:
        if data.admin_secret != ADMIN_SECRET:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid admin secret key")

        result = await self.db.execute(
            text("SELECT id, name, email, password, role FROM users WHERE email = :email AND role = 'admin'"),
            {"email": data.email}
        )
        user = result.fetchone()
        if not user or not verify_password(data.password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")

        await self.db.execute(
            text("INSERT INTO admin_logs (admin_id, action, target_type, target_id, timestamp) VALUES (:id, 'LOGIN', 'user', :id, NOW())"),
            {"id": user.id}
        )
        await self.db.commit()
        return self._make_tokens(user, admin=True)

    async def refresh(self, refresh_token: str) -> TokenResponse:
        payload = decode_refresh_token(refresh_token)
        result = await self.db.execute(
            text("SELECT id, name, email, role FROM users WHERE id = :id"),
            {"id": int(payload["sub"])}
        )
        user = result.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return self._make_tokens(user)

    def _make_tokens(self, user, admin: bool = False) -> TokenResponse:
        data = {"sub": str(user.id), "email": user.email, "role": user.role}
        expiry = timedelta(hours=8) if admin else None
        return TokenResponse(
            access_token=create_access_token(data, expiry),
            refresh_token=create_refresh_token(data),
            user={"id": user.id, "name": user.name, "email": user.email, "role": user.role}
        )
