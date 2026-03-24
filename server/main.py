from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Enable CORS so React can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root test route
@app.get("/")
def root():
    return {"message": "FastAPI server is running"}

# ✅ Claims API (used by your React app)
@app.get("/claims")
def get_claims():
    return {
        "approved": 120,
        "pending": 45,
        "rejected": 12
    }