from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
def login():
    return {"message": "Login successful"}

@router.post("/signup")
def signup():
    return {"message": "Signup successful"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.auth.models import User
from src.auth.service import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(name: str, email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(name=name, email=email, password=hash_password(password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created"}

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": user.email})
    return {"access_token": token}

from fastapi import APIRouter, HTTPException
from auth.service import *

router = APIRouter()

# Fake in-memory user
fake_user = {
    "email": "durga@gmail.com",
    "password": hash_password("1234")
}

@router.post("/login")
def login(data: dict):
    if data["email"] != fake_user["email"]:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(data["password"], fake_user["password"]):
        raise HTTPException(status_code=400, detail="Wrong password")

    access = create_access_token({"sub": data["email"]})
    refresh = create_refresh_token({"sub": data["email"]})

    return {
        "access_token": access,
        "refresh_token": refresh
    }

