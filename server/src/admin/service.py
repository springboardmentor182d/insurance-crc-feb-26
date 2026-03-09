from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

import bcrypt

from src.auth.models import RegisterRequest, AdminLogin
from src.auth.service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)

ADMIN_SECRET = "bimaverse-admin-2026"


async def admin_signup(data: RegisterRequest, db: AsyncSession):
    exists = await db.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": data.email}
    )
    if exists.fetchone():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    await db.execute(
        text("""
            INSERT INTO users (name, email, password, role, created_at)
            VALUES (:name, :email, :password, 'admin', NOW())
        """),
        {
            "name": data.name,
            "email": data.email,
            "password": hash_password(data.password),
        }
    )
    await db.commit()
    return {"message": "Admin created successfully"}


async def admin_login(data: AdminLogin, db: AsyncSession):
    if data.admin_secret != ADMIN_SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid admin secret"
        )

    result = await db.execute(
        text("SELECT id, name, email, password, role FROM users WHERE email = :email AND role = 'admin'"),
        {"email": data.email}
    )
    user = result.fetchone()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token_data = {"sub": str(user.id), "email": user.email, "role": user.role}

    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": {"id": user.id, "g": user.name, "email": user.email, "role": user.role}
    }