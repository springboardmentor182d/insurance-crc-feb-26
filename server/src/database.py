# =========================
# 1. Imports
# =========================
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv


# =========================
# 2. Load .env (IMPORTANT FIX)
# =========================
# This ensures .env is loaded correctly even if it's outside src folder
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))


# =========================
# 3. Get DATABASE_URL
# =========================
DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql://insurance_user:Nitu%40123@localhost:5432/insurance_db"

print("DATABASE_URL loaded:", DATABASE_URL)  # DEBUG (remove later)

# =========================
# 4. Validation
# =========================
if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL is not set. Please check your .env file."
    )

if not DATABASE_URL.startswith("postgresql"):
    raise ValueError(
        f"Invalid DATABASE_URL: {DATABASE_URL}. "
        "This app requires PostgreSQL."
    )


# =========================
# 5. Create Engine
# =========================
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    echo=False
)


# =========================
# 6. Session
# =========================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# =========================
# 7. Base Model
# =========================
Base = declarative_base()


# =========================
# 8. Dependency
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# 9. Initialize DB
# =========================
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ PostgreSQL database initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        raise