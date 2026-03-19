import hashlib

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.models import User

router = APIRouter(tags=["Auth"])


class AuthPayload(BaseModel):
    full_name: str | None = None
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


def _hash_password(raw_password: str) -> str:
    return hashlib.sha256(raw_password.encode("utf-8")).hexdigest()


@router.post("/login")
def login(payload: AuthPayload, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or user.password_hash != _hash_password(payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
        },
    }


@router.post("/signup")
def signup(payload: AuthPayload, db: Session = Depends(get_db)) -> dict:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists",
        )

    full_name = (payload.full_name or "").strip() or payload.email.split("@")[0]

    user = User(
        full_name=full_name,
        email=payload.email,
        password_hash=_hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Signup successful",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
        },
    }
