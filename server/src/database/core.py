from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

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

    Base.metadata.create_all(bind=engine)