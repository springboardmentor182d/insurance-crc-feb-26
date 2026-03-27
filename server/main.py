

import sys
from pathlib import Path


sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.modules.auth.controller import router as auth_router
from src.modules.insurance.controller import router as insurance_router
from src.modules.recommendation.controller import router as recommendation_router
from src.modules.claims.controller import router as claims_router

app = FastAPI(
    title="Insurance Assistant API",
    description="API for insurance comparison, recommendation & claim assistance",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(auth_router)
app.include_router(insurance_router)
app.include_router(recommendation_router)
app.include_router(claims_router)


@app.get("/")
async def root():
    """
    Root endpoint - health check
    
    Returns:
        Welcome message and API information
    """
    return {
        "message": "Welcome to Insurance Assistant API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    
    Returns:
        Status of the API
    """
    return {
        "status": "healthy",
        "message": "Server is running"
    }


if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("Insurance Assistant API Starting...")
    print("=" * 60)
    print("API Documentation: http://localhost:8000/docs")
    print("Redoc Documentation: http://localhost:8000/redoc")
    print("=" * 60)
    
    
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  
    )
