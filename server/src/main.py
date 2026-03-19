import os
import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api import api_router
from src.database.core import init_db

load_dotenv()

app = FastAPI(title="Insurance CRC Management API", version="1.0.0")
logger = logging.getLogger(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    try:
        init_db()
        app.state.db_ready = True
    except Exception as exc:
        # Keep API process running even when DB is temporarily unavailable.
        app.state.db_ready = False
        logger.warning("Database initialization failed; starting API in degraded mode: %s", exc)


app.include_router(api_router, prefix="/api")


@app.get("/health")
def health_check() -> dict:
    return {
        "status": "Backend is running",
        "database": "ready" if getattr(app.state, "db_ready", False) else "unavailable",
    }


@app.get("/")
def root() -> dict:
    return {"message": "Insurance CRC Management API", "docs": "/docs"}

