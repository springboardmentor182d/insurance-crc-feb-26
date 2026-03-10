# Auth service - handles business logic for authentication
from datetime import datetime, timedelta
import jwt
from typing import Optional
from models.database import users_db
from models.user import User, UserResponse, LoginResponse

# Simple secret key for JWT token (use environment variable in production)
SECRET_KEY = "insurance-app-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_token(user_id: int) -> str:
    """
    Create a JWT token for the user
    
    Args:
        user_id: The user ID to encode in the token
        
    Returns:
        JWT token string
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_token(token: str) -> Optional[int]:
    """
    Verify and decode a JWT token
    
    Args:
        token: The token to verify
        
    Returns:
        User ID if token is valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except:
        return None

def user_exists(email: str) -> bool:
    """Check if user already exists"""
    return any(user["email"] == email for user in users_db)

def create_user(full_name: str, email: str, password: str) -> User:
    """
    Create a new user in the database
    
    Args:
        full_name: User's full name
        email: User's email
        password: User's password
        
    Returns:
        The created user
    """
    new_user = {
        "id": len(users_db) + 1,
        "full_name": full_name,
        "email": email,
        "password": password  # In production, hash the password!
    }
    users_db.append(new_user)
    return new_user

def verify_user(email: str, password: str) -> Optional[dict]:
    """
    Verify user credentials
    
    Args:
        email: User's email
        password: User's password
        
    Returns:
        User object if credentials are valid, None otherwise
    """
    for user in users_db:
        if user["email"] == email and user["password"] == password:
            return user
    return None
