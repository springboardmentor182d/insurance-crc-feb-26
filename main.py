"""
Insurance Comparison, Recommendation & Claim Assistant
FastAPI Backend Server

This backend provides APIs for:
- User authentication (signup/login)
- Insurance plan management and comparison
- Insurance recommendations
- Insurance claim submission
"""

import sys
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers from modules
from src.modules.auth.controller import router as auth_router
from src.modules.insurance.controller import router as insurance_router
from src.modules.recommendation.controller import router as recommendation_router
from src.modules.claims.controller import router as claims_router

# Create FastAPI application
app = FastAPI(
    title="Insurance Assistant API",
    description="API for insurance comparison, recommendation & claim assistance",
    version="1.0.0"
)

# Enable CORS (Cross-Origin Resource Sharing) to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development purposes)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(auth_router)
app.include_router(insurance_router)
app.include_router(recommendation_router)
app.include_router(claims_router)

# Health check endpoint
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

# Main entry point
if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("Insurance Assistant API Starting...")
    print("=" * 60)
    print("API Documentation: http://localhost:8000/docs")
    print("Redoc Documentation: http://localhost:8000/redoc")
    print("=" * 60)
    
    # Run the server
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Enable auto-reload on code changes
    )
