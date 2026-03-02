from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import date, datetime

class RegisterRequest(BaseModel):
    name: str     
    email: EmailStr
    password: str
    date_of_birth: Optional[date] = None

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False

class AdminLogin(BaseModel):
    email: EmailStr
    password: str
    admin_secret: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Backward compatibility aliases
UserRegister = RegisterRequest
UserLogin = LoginRequest
