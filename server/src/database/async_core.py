from __future__ import annotations

import os
from pathlib import Path
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Load .env from project root
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)


def _build_async_database_url() -> str:
    explicit_url = os.getenv("DATABASE_URL")
    if explicit_url:
        if "asyncpg" in explicit_url:
            return explicit_url
        return explicit_url.replace("psycopg2", "asyncpg")

    user = os.getenv("POSTGRES_USER", "bimaverse_user")
    password = os.getenv("POSTGRES_PASSWORD", "bimaverse_pass")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    database = os.getenv("POSTGRES_DB", "bimaverse")

    return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{database}"


ASYNC_DATABASE_URL = _build_async_database_url()

async_engine = create_async_engine(ASYNC_DATABASE_URL, pool_pre_ping=True, future=True)
AsyncSessionLocal = async_sessionmaker(bind=async_engine, expire_on_commit=False)


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
