from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from src.api import api_router
from src.database.core import SessionLocal
from src.database.seeds import seed_fraud_rules
from src.exceptions import setup_exception_handlers
from src.logging import setup_logging
from src.database.core import engine, Base
# This line creates all tables that are currently imported in your app
Base.metadata.create_all(bind=engine)

setup_logging()
app = FastAPI(
    title="BimaVerse API",
    description="Insurance Comparison, Recommendation & Claim Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)


@app.on_event("startup")
def startup_db_check():
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
        seed_fraud_rules()
    except SQLAlchemyError as exc:
        raise RuntimeError("Database connection failed on startup.") from exc


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "BimaVerse API"}


@app.get("/")
async def root():
    return {"message": "BimaVerse API is running"}


# Keep /api/v1 (new client) and root-prefixed routes (backward compatibility)
app.include_router(api_router, prefix="/api/v1")
app.include_router(api_router)
