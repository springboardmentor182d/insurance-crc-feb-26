# =========================
# 1. Imports
# =========================
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
print("DATABASE_URL:", DATABASE_URL)
# =========================
# 2. Load .env
# =========================
load_dotenv()

# =========================
# 3. Get DATABASE_URL
# =========================
DATABASE_URL = "postgresql://insurance_user:Nitu%40123@localhost:5432/insurance_db"

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env file")

# ✅ Enforce PostgreSQL only (mentor requirement)
if not DATABASE_URL.startswith("postgresql"):
    raise ValueError("Only PostgreSQL is supported")

# =========================
# 4. Create Engine
# =========================
engine = create_engine(
    DATABASE_URL,
    echo=True  # Optional: shows SQL logs (good for debugging)
)

# =========================
# 5. Session
# =========================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =========================
# 6. Base Model
# =========================
Base = declarative_base()

# =========================
# 7. Dependency (DB Session)
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# 8. Initialize DB
# =========================
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database connected & tables created successfully")
    except Exception as e:
        print(" Database connection failed:", e)
        raise e