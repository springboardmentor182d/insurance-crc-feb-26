import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from . import models, database
from .routers.admin import router as admin_router
from .routers.catalog import router as catalog_router
from .routers.recommendations import router as recommendations_router

# ✅ AI router (your recommendation engine)
from src.recommendation_engine import router as ai_router


# Load environment variables
load_dotenv()

# Initialize database
database.init_db()

# Create FastAPI app
app = FastAPI(
    title="Insurance CRC Management API",
    version="1.0.0"
)

# Configure CORS
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin_router)
app.include_router(catalog_router)
app.include_router(recommendations_router)
app.include_router(ai_router)   # ✅ AI endpoint


# Startup event
@app.on_event("startup")
async def startup_event():
    db = database.SessionLocal()
    try:
        if db.query(models.User).count() == 0:
            print("✓ Database ready")
    except Exception as e:
        print("Startup error:", e)
    finally:
        db.close()


# Health check
@app.get("/health")
def health_check():
    return {"status": "Backend is running"}


# Root
@app.get("/")
def root():
    return {
        "message": "Insurance CRC Management API",
        "docs": "/docs"
    }