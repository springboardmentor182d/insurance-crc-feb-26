from fastapi import APIRouter
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])