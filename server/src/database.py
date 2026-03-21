"""Backward-compatible database exports.

This module keeps older imports working while using the PostgreSQL-only
configuration from src.database.core.
"""

from src.database.core import Base, DATABASE_URL, SessionLocal, engine, get_db, init_db

__all__ = ["Base", "DATABASE_URL", "SessionLocal", "engine", "get_db", "init_db"]

