import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import database
from .auth.controller import router as auth_router
from .routers.admin import router as admin_router
from .routers.catalog import router as catalog_router

# Load environment variables and initialize database tables.
load_dotenv()
database.init_db()

app = FastAPI(
    title="Insurance CRC Management API",
    description="Insurance management backend APIs",
    version="1.0.0",
)

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router)
app.include_router(catalog_router)
app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {"status": "Backend is running", "service": "Insurance CRC API"}


@app.get("/")
def root():
    return {
        "message": "Insurance CRC Management API",
        "version": "1.0.0",
        "docs": "/docs",
    }
