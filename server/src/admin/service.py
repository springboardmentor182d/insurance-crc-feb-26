from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from passlib.context import CryptContext

from src.entities.user import User
from src.auth.jwt import create_access_token
from src.auth.models import RegisterRequest, AdminLogin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_SECRET = "admin-secret-key"


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


def admin_signup(data: RegisterRequest, db: Session):

    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_admin = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        first_name=data.name,
        role="admin"
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {"message": "Admin created successfully"}


def admin_login(data: AdminLogin, db: Session):

    if data.admin_secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid admin secret")

    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")

    token = create_access_token({"sub": user.id})

    return {
        "access_token": token,
        "token_type": "bearer"
    }