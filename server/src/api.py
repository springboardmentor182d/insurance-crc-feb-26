from fastapi import APIRouter
from src.auth.controller import router as auth_router
from src.routers.admin import router as admin_router
from src.routers.catalog import router as catalog_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])
api_router.include_router(catalog_router, tags=["Catalog"])
