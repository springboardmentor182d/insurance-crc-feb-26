import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import local modules
from . import models, database
from .routers.admin import router as admin_router
from .routers.catalog import router as catalog_router
from .routers.recommendations import router as recommendations_router

load_dotenv()
database.init_db()

app = FastAPI(
    title="Insurance CRC Management API",
    version="1.0.0"
)


allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.on_event("startup")
async def startup_event():
    pass

app.include_router(admin_router)
app.include_router(catalog_router)
app.include_router(recommendations_router)

@app.get("/health")
def health_check():
    return {"status": "Backend is running"}

@app.get("/")
def root():
    return {"message": "Insurance CRC Management API", "docs": "/docs"}

