from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "InsureLogic API Running 🚀"}

try:
    from src.auth.routes import router as auth_router
    app.include_router(auth_router)
    print("✅ Auth routes loaded")
except Exception as e:
    print("❌ Auth route error:", e)