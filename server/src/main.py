from fastapi import FastAPI
from src.api import router
from fastapi.middleware.cors import CORSMiddleware

from src.database.core import Base, engine
from src.users.controller import router as users_router
from src.auth.controller import router as auth_router
from src.fraud.controller import router as fraud_router
from src.fraud import models
app = FastAPI()

# create tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(auth_router)
app.include_router(fraud_router)


@app.get("/")
def home():
    return {"message": "FastAPI server running"}