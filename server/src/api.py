from fastapi import APIRouter
from src.auth.controller import router as auth_router
from src.admin.controller import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(admin_router)
