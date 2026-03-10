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
