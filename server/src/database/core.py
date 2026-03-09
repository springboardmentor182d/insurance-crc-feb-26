
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Get PostgreSQL database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Validate that PostgreSQL URL is provided
if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set. "
        "Please configure PostgreSQL connection in .env file. "
        "Example: DATABASE_URL=postgresql://user:password@localhost:5432/database_name"
    )

if not DATABASE_URL.startswith("postgresql"):
    raise ValueError(
        f"Invalid DATABASE_URL: {DATABASE_URL}. "
        "This application requires PostgreSQL. "
        "Please set DATABASE_URL to a valid PostgreSQL connection string. "
        "Example: postgresql://user:password@localhost:5432/database_name"
    )

# Create PostgreSQL engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connection health before using from pool
    pool_size=10,         # Number of connections to keep in the pool
    max_overflow=20,      # Maximum number of connections that can be created beyond pool_size
    pool_recycle=3600,    # Recycle connections after 1 hour
    echo=False            # Set to True for SQL query debugging
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    """
    Database dependency for FastAPI endpoints.
    Creates a new database session for each request and closes it after.
    """
