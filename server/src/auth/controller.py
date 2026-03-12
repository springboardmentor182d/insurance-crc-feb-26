from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


# ==============================
# Request Models
# ==============================

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ==============================
# Signup API
# ==============================

@router.post("/signup")
def signup(user: SignupRequest):

    return {
        "message": "Signup successful",
        "user": {
            "name": user.name,
            "email": user.email
        }
    }


# ==============================
# Login API
# ==============================

@router.post("/login")
def login(user: LoginRequest):

    # dummy login check (later connect with database)
    if user.email == "xfh@gmail.com" and user.password == "suchi32":
        return {
            "access_token": "sample-jwt-token",
            "token_type": "bearer"
        }

    raise HTTPException(
        status_code=401,
        detail="Invalid email or password"
    )