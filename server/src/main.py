from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from src.api import api_router
from src.database.core import SessionLocal, engine, Base, create_tables
from src.database.seeds import seed_fraud_rules
from src.exceptions import setup_exception_handlers
from src.logging import setup_logging

# ✅ Create tables (with all models imported)
create_tables()

# ✅ Setup logging
setup_logging()

# ✅ Create FastAPI app
app = FastAPI(
    title="BimaVerse API",
    description="Insurance Comparison, Recommendation & Claim Assistant",
    version="1.0.0",
)

# ✅ CORS FIX (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Exception handlers
setup_exception_handlers(app)


# ✅ Startup check
@app.on_event("startup")
def startup_db_check():
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise RuntimeError("Database connection failed on startup.") from exc

    try:
        seed_fraud_rules()
    except SQLAlchemyError:
        pass


# ✅ Health route
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "BimaVerse API"}


# ✅ Root route
@app.get("/")
async def root():
    return {"message": "BimaVerse API is running"}


# ✅ ROUTERS (FIXED - NO DUPLICATION)
app.include_router(api_router, prefix="/api/v1")
