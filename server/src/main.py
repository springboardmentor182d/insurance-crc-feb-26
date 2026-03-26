import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Local modules
from . import models, database
from .routers.admin import router as admin_router
from .routers.catalog import router as catalog_router
from .routers.recommendations import router as recommendations_router
from src.routers.user import router as user_router
from src.recommendation_engine import router as ai_router


# =========================
# LOAD ENV
# =========================
load_dotenv()

# =========================
# INIT DB
# =========================
database.init_db()

# =========================
# CREATE APP (FIRST!)
# =========================
app = FastAPI(
    title="Insurance CRC Management API",
    version="1.0.0"
)

# =========================
# CORS
# =========================
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS (AFTER APP CREATED)
# =========================
app.include_router(admin_router)
app.include_router(catalog_router)
app.include_router(recommendations_router)
app.include_router(ai_router)
app.include_router(user_router)

# =========================
# STARTUP
# =========================
def populate_sample_data():
    db = database.SessionLocal()
    try:
        if db.query(models.User).count() > 0:
            return
        db.commit()
        print("✓ Sample data ready")
    except Exception as e:
        db.rollback()
        print("Error:", e)
    finally:
        db.close()


@app.on_event("startup")
async def startup_event():
    populate_sample_data()

# =========================
# ROUTES
# =========================
@app.get("/health")
def health_check():
    return {"status": "Backend is running"}


@app.get("/")
def root():
    return {
        "message": "Insurance CRC Management API",
        "docs": "/docs"
    }