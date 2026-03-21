import os
from pathlib import Path
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.exc import InvalidRequestError

# Load .env from project root
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)


def _build_database_url() -> str:
    # For local development we prefer a lightweight sqlite DB so the
    # backend can run without a running Postgres instance. This avoids
    # startup failures when Postgres isn't available on the host machine.
    sqlite_path = Path(__file__).resolve().parents[2] / "dev_data.sqlite3"
    return f"sqlite:///{sqlite_path.as_posix()}"


DATABASE_URL = _build_database_url()

engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables() -> None:
    try:
        import src.database.models  # noqa: F401
    except InvalidRequestError:
        # If models have already been defined in this interpreter session,
        # ignore and continue to create tables (if needed).
        pass

    try:
        Base.metadata.create_all(bind=engine)
    except InvalidRequestError:
        # During rapid development the same table may be defined more than once
        # in the same interpreter session. In that case, ignore and continue.
        pass