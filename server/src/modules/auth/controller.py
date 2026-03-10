# Auth controller - handles HTTP requests for authentication
from fastapi import APIRouter, HTTPException, status
from models.user import UserSignup, UserLogin, LoginResponse, UserResponse
from modules.auth.service import create_user, verify_user, create_token, user_exists

# Create a router for auth endpoints
router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/signup")
async def signup(user: UserSignup):
    """
    User signup endpoint
    
    Args:
        user: User signup data (full_name, email, password)
        
    Returns:
        Token and user information
    """
    # Check if user already exists
    if user_exists(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create new user
    new_user = create_user(user.full_name, user.email, user.password)
    
    # Create token
    token = create_token(new_user["id"])
    
    # Return response
    return {
        "token": token,
        "user": UserResponse(
            id=new_user["id"],
            full_name=new_user["full_name"],
            email=new_user["email"]
        )
    }

@router.post("/login")
async def login(user: UserLogin):
    """
    User login endpoint
    
    Args:
        user: User login data (email, password)
        
    Returns:
        Token and user information
    """
    # Verify user credentials
    existing_user = verify_user(user.email, user.password)
    
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    token = create_token(existing_user["id"])
    
    # Return response
    return {
        "token": token,
        "user": UserResponse(
            id=existing_user["id"],
            full_name=existing_user["full_name"],
            email=existing_user["email"]
        )
    }
