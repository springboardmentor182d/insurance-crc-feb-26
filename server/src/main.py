from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import router
from src.policies.router import router

# Import DB setup
from src.database.core import engine, Base
from src.entities.policy import PolicyDB

# Create tables (only if DB exists)
Base.metadata.create_all(bind=engine, checkfirst=True)

# Create FastAPI app
app = FastAPI()

# CORS (frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Test route (VERY IMPORTANT)
@app.get("/")
def home():
    return {"message": "Backend is working"}

# Include your routes
app.include_router(router)