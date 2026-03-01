from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.auth.controller import router as auth_router

app = FastAPI()

# ===== CORS (Frontend connection) =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Test route =====
@app.get("/")
def home():
    return {"message": "Backend running"}

@app.get("/test")
def test():
    return {"status": "connected"}

# ===== Auth Routes =====
app.include_router(auth_router)