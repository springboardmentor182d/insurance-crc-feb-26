import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

# Load .env from project root
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)


def _build_database_url() -> str:
    explicit_url = os.getenv("DATABASE_URL")
    if explicit_url:
        return explicit_url

    user     = os.getenv("POSTGRES_USER",     "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "password")
    host     = os.getenv("POSTGRES_HOST",     "localhost")
    port     = os.getenv("POSTGRES_PORT",     "5432")
    database = os.getenv("POSTGRES_DB",       "bimaverse")

    return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{database}"


DATABASE_URL = _build_database_url()

engine = create_async_engine(DATABASE_URL, echo=True, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()