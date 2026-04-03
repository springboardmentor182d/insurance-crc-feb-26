from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.db.session import Base, engine
from src.api.v1.routes.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="InsureHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "InsureHub API is running"}
