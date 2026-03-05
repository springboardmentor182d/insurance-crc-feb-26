from __future__ import annotations

import pytest
from sqlalchemy import text

from src.database.core import SessionLocal
from src.database.seed import seed_database


@pytest.fixture(scope="session")
def seeded_db() -> None:
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
    except Exception as exc:  # pragma: no cover
        pytest.skip(f"PostgreSQL is not available for integration tests: {exc}")

    seed_database()
