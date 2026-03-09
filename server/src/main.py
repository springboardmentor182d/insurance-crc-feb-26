from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from src.database.core import Base, engine, SessionLocal
from src.entities.user import User
from src.entities.dashboard import DashboardData
from src.schemas.user_schema import UserCreate, UserResponse


app = FastAPI()

# Create tables automatically
Base.metadata.create_all(bind=engine)


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/dashboard-data")
def get_dashboard_data(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    
    # Fetch from DB to satisfy PR requirement "get the data from db"
    dashboard = db.query(DashboardData).first()
    
    if not dashboard:
        # Seed the DB if it's completely empty so it works out of the box
        dashboard = DashboardData(
            total_policies=8,
            active_claims=2,
            recommended_policies=5,
            claim_status="Approved",
            recent_policies=[
                {"provider": "HealthGuard Insurance", "type": "Health Insurance", "coverage": "$100,000", "status": "Active"},
                {"provider": "AutoSecure Plus", "type": "Auto Insurance", "coverage": "$50,000", "status": "Active"},
                {"provider": "HomeProtect Premium", "type": "Home Insurance", "coverage": "$300,000", "status": "Active"}
            ]
        )
        db.add(dashboard)
        db.commit()
        db.refresh(dashboard)

    return {
        "active_policies": total_users,
        "total_policies": dashboard.total_policies,
        "active_claims": dashboard.active_claims,
        "recommended_policies": dashboard.recommended_policies,
        "claim_status": dashboard.claim_status,
        "recent_policies": dashboard.recent_policies
    }


# Create User
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name, email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# Get All Users
@app.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()