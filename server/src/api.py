from fastapi import APIRouter
from src.routers.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])

# Backward-compatible alias
router = api_router
