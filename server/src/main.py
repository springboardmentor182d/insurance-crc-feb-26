from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.core import Base, engine
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health_check():
    return {"status": "Backend is running"}
app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "FastAPI running"}