from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import api_router  # Imports the master router we just created
app = FastAPI(title="BimaVerse API",
    description="Backend services for the BimaVerse Insurance Dashboard",
    version="1.0.0")


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/health")
# def health_check():
#     return {"status": "Backend is running"}

# Include the master API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to BimaVerse API. Visit /docs for Swagger UI."}
