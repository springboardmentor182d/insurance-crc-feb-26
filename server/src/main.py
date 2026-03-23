# =========================
# 1. Imports
# =========================
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import local modules
from . import models, database
from .routers.admin import router as admin_router
from .routers.catalog import router as catalog_router
<<<<<<< HEAD
from .routers.ai import router as ai_router   # ✅ FIXED IMPORT

from . import database, models


# =========================
# 2. Load Environment Variables
# =========================
load_dotenv()


# =========================
# 3. Initialize Database
# =========================
from .routers.recommendations import router as recommendations_router

load_dotenv()
database.init_db()


# =========================
# 4. Create FastAPI App (CREATE FIRST)
# =========================
app = FastAPI(
    title="Insurance CRC Management API",
    version="1.0.0"
)


# =========================
# 5. Configure CORS
# =========================
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"
).split(",")

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


<<<<<<< HEAD
# =========================
# 6. Include Routers (ALL HERE)
# =========================
app.include_router(admin_router)
app.include_router(catalog_router)
app.include_router(ai_router)   # ✅ NOW CORRECT


# =========================
# 7. Populate Sample Data
# =========================
def populate_sample_data():
    db = database.SessionLocal()
    try:
        if db.query(models.User).count() > 0:
            print("✓ Database already contains data, skipping population")
            return

        # (KEEP YOUR EXISTING SAMPLE DATA)

        db.commit()
        print("✓ Sample insurance data populated successfully")

    except Exception as e:
        print(f"✗ Error populating sample data: {e}")
        db.rollback()
    finally:
        db.close()

# =========================
# 8. Startup Event
# =========================
@app.on_event("startup")
async def startup_event():
    populate_sample_data()


# =========================
# 9. Routes
# =========================
@app.get("/health")
def health_check():
    return {"status": "Backend is running", "service": "Insurance CRC API"}


@app.get("/")
def root():
    return {
        "message": "Insurance CRC Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }
    pass

app.include_router(admin_router)
app.include_router(catalog_router)
app.include_router(recommendations_router)

@app.get("/health")
def health_check():
    return {"status": "Backend is running"}

@app.get("/")
def root():
    return {"message": "Insurance CRC Management API", "docs": "/docs"}
