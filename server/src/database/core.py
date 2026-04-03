import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load .env from the server root so imports work regardless of the current cwd.
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)


def _build_database_url() -> str:
    explicit_url = os.getenv("DATABASE_URL")
    if explicit_url:
        return explicit_url

    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    database = os.getenv("POSTGRES_DB")

    if user and password and database:
        return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"

    raise RuntimeError(
        "Database configuration missing. Set DATABASE_URL or POSTGRES_USER, "
        "POSTGRES_PASSWORD, and POSTGRES_DB in server/.env."
    )


DATABASE_URL = _build_database_url()

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables() -> None:
    # Ensure all ORM models are registered before create_all
    import src.database.admin_dashboard.models  # noqa: F401
    import src.database.manage_policies.models  # noqa: F401
    import src.auth.db_models  # noqa: F401
    import src.auth.oauth_models  # noqa: F401
    import src.entities.active_policy  # noqa: F401
    import src.entities.policy_document  # noqa: F401

    Base.metadata.create_all(bind=engine)
