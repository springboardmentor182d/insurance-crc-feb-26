from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models.user import Base

from app.routers import user as user_router
from app.routers import ai


# ✅ CREATE FASTAPI APP FIRST
app = FastAPI(
    title="Insurance Backend API",
    version="1.0.0"
)


# ✅ CORS (React frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ CREATE DATABASE TABLES
Base.metadata.create_all(bind=engine)


# ✅ REGISTER ROUTERS (AFTER app CREATED)
app.include_router(user_router.router)
app.include_router(ai.router)


# ✅ ROOT API
@app.get("/", tags=["Root"])
def root():
    return {"message": "Insurance Backend Running"}