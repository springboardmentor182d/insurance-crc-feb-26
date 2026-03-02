from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from src.auth.controller import router as auth_router
api_router = APIRouter(prefix="/api/v1")  
api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
from src.api import api_router
from src.exceptions import setup_exception_handlers
from src.logging import setup_logging

setup_logging()

app = FastAPI(
    title="BimaVerse API",
    description="Insurance Comparison, Recommendation & Claim Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)
app.include_router(api_router)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "BimaVerse API"}

@app.get("/")
async def root():
    return {"message": "BimaVerse API is running"}
from fastapi import APIRouter
from src.users.controller import router as users_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(users_router)
