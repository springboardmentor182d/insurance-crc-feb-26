from datetime import datetime, timedelta

import psycopg
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": "localhost",
    "dbname": "insurance_dashboard_db",
    "user": "postgres",
    "password": "1234",
    "port": 5432,
}

SECRET_KEY = "your_secret_key_12345"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/")
def home():
    return {"message": "Backend is working with PostgreSQL and JWT ✅"}


@app.post("/api/login")
def login(email: str, password: str):
    conn = psycopg.connect(
        host=DB_CONFIG["host"],
        dbname=DB_CONFIG["dbname"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        port=DB_CONFIG["port"],
    )
    cur = conn.cursor()

    cur.execute(
        "SELECT id, password FROM users WHERE email = %s",
        (email,),
    )
    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    db_user_id = user[0]
    db_password = user[1]

    if password != db_password:
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token({"sub": str(db_user_id)})
    refresh_token = create_refresh_token({"sub": str(db_user_id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@app.post("/api/refresh")
def refresh_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        new_access_token = create_access_token({"sub": str(user_id)})

        return {
            "access_token": new_access_token,
            "token_type": "bearer",
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@app.get("/api/dashboard")
def get_dashboard(current_user: str = Depends(get_current_user)):
    conn = psycopg.connect(
        host=DB_CONFIG["host"],
        dbname=DB_CONFIG["dbname"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        port=DB_CONFIG["port"],
    )

    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM policies WHERE status = 'Active';")
    active_policies = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM claims;")
    total_claims = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM claims WHERE status = 'Approved';")
    approved_claims = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM claims WHERE status = 'Pending';")
    pending_claims = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM claims WHERE status = 'Processing';")
    processing_claims = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM claims WHERE status = 'Rejected';")
    rejected_claims = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {
        "summaryCards": [
            {"title": "Approved Today", "value": str(approved_claims)},
            {"title": "Pending", "value": str(pending_claims)},
            {"title": "Processing", "value": str(processing_claims)},
            {"title": "Accuracy", "value": "98%"},
            {"title": "Avg Response", "value": "2.4h"},
            {"title": "Rejected", "value": str(rejected_claims)},
        ],
        "statCards": [
            {"title": "Active Policies", "value": str(active_policies), "change": "12.5%", "extra": "+356"},
            {"title": "Total Claims", "value": str(total_claims), "change": "8.2%", "extra": "+37"},
            {"title": "Monthly Revenue", "value": "$52.8K", "change": "15.3%", "extra": "+$6.9K"},
            {"title": "Satisfaction Score", "value": "96%", "change": "2.1%", "extra": "Excellent"},
        ],
        "revenueData": [
            {"month": "Jan", "revenue": 35000, "satisfaction": 88},
            {"month": "Feb", "revenue": 42000, "satisfaction": 90},
            {"month": "Mar", "revenue": 39000, "satisfaction": 89},
            {"month": "Apr", "revenue": 48000, "satisfaction": 93},
            {"month": "May", "revenue": 45000, "satisfaction": 92},
            {"month": "Jun", "revenue": 52000, "satisfaction": 96},
        ],
        "radarData": [
            {"subject": "Claims Processing", "A": 96},
            {"subject": "Customer", "A": 88},
            {"subject": "Policy Accuracy", "A": 94},
            {"subject": "Response Time", "A": 90},
            {"subject": "Detection", "A": 84},
        ],
        "pieData": [
            {"name": "Health", "value": 987, "color": "#ec4899"},
            {"name": "Life", "value": 789, "color": "#a855f7"},
            {"name": "Auto", "value": 621, "color": "#f472b6"},
            {"name": "Home", "value": 450, "color": "#c084fc"},
        ],
        "claimsStatusData": [
            {"name": "Approved", "value": approved_claims, "fill": "#10b981"},
            {"name": "Pending", "value": pending_claims, "fill": "#f59e0b"},
            {"name": "Processing", "value": processing_claims, "fill": "#3b82f6"},
            {"name": "Rejected", "value": rejected_claims, "fill": "#ef4444"},
        ],
        "topPerformers": [
            {"name": "Premium Health Plus", "sales": 342, "amount": "$102,300", "growth": "+18%"},
            {"name": "Life Guardian Pro", "sales": 289, "amount": "$86,700", "growth": "+15%"},
            {"name": "Auto Shield Elite", "sales": 234, "amount": "$62,400", "growth": "+22%"},
            {"name": "Home Secure Premium", "sales": 198, "amount": "$59,400", "growth": "+12%"},
        ],
    }