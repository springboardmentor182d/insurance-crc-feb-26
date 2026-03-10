import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables
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

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for declarative models
Base = declarative_base()


def get_db():
    """
    Database dependency for FastAPI endpoints.
    Creates a new database session for each request and closes it after.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize PostgreSQL database and create all tables.
    This should be called when starting the application.
    """
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ PostgreSQL database initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing PostgreSQL database: {str(e)}")
        raise

