from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Correct import after restructuring
from src.auth.routes import router as auth_router

app = FastAPI()

# ==============================
# CORS CONFIGURATION
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Include Auth Routes
# ==============================

app.include_router(auth_router)

# ==============================
# Root Endpoint
# ==============================

@app.get("/")
def root():
    return {"message": "InsureLogic API Running"}