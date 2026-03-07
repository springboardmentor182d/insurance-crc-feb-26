from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.users.service import create_user, login_user
from pydantic import BaseModel

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):

    user = create_user(db, data.name, data.email, data.password)

    return {"message": "User created", "email": user.email}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = login_user(db, data.email, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "email": user.email,
        "role": user.role
    }