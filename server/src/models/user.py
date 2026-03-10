from pydantic import BaseModel, EmailStr
from typing import Optional

# User model for signup and login
class UserSignup(BaseModel):
    """Model for user signup"""
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    """Model for user login"""
    email: EmailStr
    password: str

class User(BaseModel):
    """User model stored in database"""
    id: int
    full_name: str
    email: str
    password: str

class UserResponse(BaseModel):
    """User response model"""
    id: int
    full_name: str
    email: str

class LoginResponse(BaseModel):
    """Login response model"""
    token: str
    user: UserResponse
