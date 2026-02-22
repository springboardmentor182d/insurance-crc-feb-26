from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql+psycopg2://insurance_user:Nitu%40123@localhost:5432/insurance_db"

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=True  # Shows SQL logs in terminal (good for development)
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()