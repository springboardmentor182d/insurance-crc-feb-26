from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from src.api import api_router
from src.database.core import SessionLocal
from src.database.seeds import seed_fraud_rules

app = FastAPI(title="Insurance CRC API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_db_check():
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
        seed_fraud_rules()
    except SQLAlchemyError as exc:
        raise RuntimeError("Database connection failed on startup.") from exc


@app.get("/health")
def health_check():
    return {"status": "Backend is running"}


app.include_router(api_router)
