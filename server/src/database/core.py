import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load the server .env reliably even when imports happen via the src package.
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)


def _build_database_url() -> str:
    explicit_url = os.getenv("DATABASE_URL")
    if explicit_url:
        return explicit_url

    user = os.getenv("POSTGRES_USER", "bimaverse_user")
    password = os.getenv("POSTGRES_PASSWORD", "bimaverse_pass")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    database = os.getenv("POSTGRES_DB", "bimaverse")

    return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"


DATABASE_URL = _build_database_url()

engine = create_engine(DATABASE_URL)

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
    import src.entities.claim_document  # noqa: F401

    Base.metadata.create_all(bind=engine)
