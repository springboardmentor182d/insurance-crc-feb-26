from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List

# Routers
from src.auth.routes import router as auth_router
from src.users.controller import router as user_router
from src.fraud_detection.controller import router as fraud_router  # 🔥 YOUR MODULE

# Database
from src.database.core import Base, engine, SessionLocal

# Models & Schemas
from src.entities.user import User
from src.entities.dashboard import DashboardData
from src.schemas.user_schema import UserCreate, UserResponse

app = FastAPI()

# ================= ROUTERS =================
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(fraud_router, prefix="/fraud")  # 🔥 FRAUD ROUTES

# ================= DATABASE SETUP =================
Base.metadata.create_all(bind=engine)

try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE dashboard_data ADD COLUMN recent_claims JSON"))
except Exception:
    pass

# ================= DB DEPENDENCY =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROOT =================
@app.get("/")
def root():
    return {"message": "InsureLogic API Running 🚀"}

# ================= DASHBOARD =================
@app.get("/api/dashboard-data")
def get_dashboard_data(db: Session = Depends(get_db)):
    total_users = db.query(User).count()

    dashboard = db.query(DashboardData).first()

    if not dashboard:
        return {
            "active_policies": total_users,
            "total_policies": 0,
            "active_claims": 0,
            "recommended_policies": 0,
            "claim_status": "-",
            "recent_policies": [],
            "recent_claims": []
        }

    return {
        "active_policies": total_users,
        "total_policies": dashboard.total_policies,
        "active_claims": dashboard.active_claims,
        "recommended_policies": dashboard.recommended_policies,
        "claim_status": dashboard.claim_status,
        "recent_policies": dashboard.recent_policies,
        "recent_claims": dashboard.recent_claims
    }

# ================= USERS =================
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name, email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()