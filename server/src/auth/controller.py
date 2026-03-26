from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict

from src.database.core import get_db
from src.auth.models import User
from src.auth.service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token
)

router = APIRouter(prefix="/auth", tags=["Auth"])


# =========================
# SIGNUP
# =========================
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: Dict[str, str], db: Session = Depends(get_db)):
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        raise HTTPException(status_code=400, detail="All fields required")

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=name,
        email=email,
        password=hash_password(password),
        income=0,
        risk_level="medium",
        insurance_type="health"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(data: Dict[str, str], db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access = create_access_token({"sub": user.email})
    refresh = create_refresh_token({"sub": user.email})

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }


# =========================
# GET USER (PROFILE)
# =========================
@router.get("/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "income": user.income,
        "risk_level": user.risk_level,
        "insurance_type": user.insurance_type
    }


# =========================
# UPDATE PREFERENCES
# =========================
@router.put("/user/{user_id}/preferences")
def update_preferences(user_id: int, data: Dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.income = data.get("income", user.income)
    user.risk_level = data.get("risk_level", user.risk_level)
    user.insurance_type = data.get("insurance_type", user.insurance_type)

    db.commit()

    return {"message": "Preferences updated successfully"}