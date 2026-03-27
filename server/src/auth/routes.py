# src/auth/routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from src.users.service import get_default_preferences
from src.database.core import SessionLocal
from src.entities.user import User   # ✅ FIXED (single model)

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

from datetime import date
from pydantic import BaseModel, EmailStr, field_validator

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    address: str
    dob: date

    @field_validator("dob")
    def validate_age(cls, value):
        from datetime import date
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))

        if age < 18:
            raise ValueError("User must be at least 18 years old")

        return value
# DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# HASH
def hash_password(password: str):
    return pwd_context.hash(password[:72])


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


# TOKEN
def create_token(data: dict):
    data.update({"exp": datetime.utcnow() + timedelta(minutes=60)})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# GET USER
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ============================
# SIGNUP
# ============================
@router.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(request.password)

    new_user = User(
        name=request.name,
        email=request.email,
        password=hashed_password,
        phone=request.phone,
        address=request.address,
        dob=request.dob,
        preferences=get_default_preferences()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}
# ============================
# LOGIN
# ============================
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token({"sub": user.email})

    return {"access_token": token}

# ============================
# ME
# ============================
@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }
