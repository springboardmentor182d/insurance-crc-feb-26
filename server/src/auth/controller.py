from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict

# Internal Project Imports
from src.database.core import get_db
from src.auth.models import User
from src.auth.service import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_refresh_token
)

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(name: str, email: str, password: str, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )

    # 2. Hash password and save new user
    new_user = User(
        name=name, 
        email=email, 
        password=hash_password(password)
    )
    db.add(new_user)
    db.commit()
    
    return {"message": "User created successfully"}

@router.post("/login")
def login(data: Dict[str, str], db: Session = Depends(get_db)):
    # 1. Find user by email
    user = db.query(User).filter(User.email == data.get("email")).first()
    
    # 2. Verify existence and password
    if not user or not verify_password(data.get("password"), user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )

    # 3. Return Access and Refresh tokens
    return {
        "access_token": create_access_token({"sub": user.email}),
        "refresh_token": create_refresh_token({"sub": user.email}),
        "token_type": "bearer"
    }