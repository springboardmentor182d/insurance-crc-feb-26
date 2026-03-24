from fastapi import FastAPI
from src.policies.router import router

from src.database.core import engine, Base
from src.entities.policy import PolicyDB

Base.metadata.create_all(bind=engine, checkfirst=True)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)