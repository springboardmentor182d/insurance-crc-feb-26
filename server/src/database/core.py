import os
from pathlib import Path
from typing import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session


def _load_env_file() -> None:
	env_path = Path(__file__).resolve().parents[2] / ".env"
	if not env_path.exists():
		return

	for raw_line in env_path.read_text(encoding="utf-8").splitlines():
		line = raw_line.strip()
		if not line or line.startswith("#") or "=" not in line:
			continue
		key, value = line.split("=", 1)
		os.environ.setdefault(key.strip(), value.strip())


_load_env_file()

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if not DATABASE_URL:
	raise RuntimeError("DATABASE_URL is required and must point to a PostgreSQL database.")

if not DATABASE_URL.startswith(("postgresql://", "postgresql+psycopg2://", "postgresql+psycopg://")):
	raise RuntimeError("Only PostgreSQL is supported. Set DATABASE_URL to a PostgreSQL connection string.")

engine = create_engine(
	DATABASE_URL,
	pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()


def init_db() -> None:
	# Import models here so metadata is fully registered before create_all runs.
	from src import models  # noqa: F401

	Base.metadata.create_all(bind=engine)
	_repair_schema()


def _repair_schema() -> None:
	inspector = inspect(engine)
	dialect = engine.dialect.name
	if dialect != "postgresql":
		raise RuntimeError("Only PostgreSQL is supported for schema operations.")

	column_plan = {
		"users": [
			("email", "VARCHAR(200)", "''"),
			("full_name", "VARCHAR(120)", "''"),
			("password_hash", "VARCHAR(128)", "''"),
			("is_active", "BOOLEAN", "TRUE"),
			("created_at", "TIMESTAMP", "CURRENT_TIMESTAMP"),
		],
		"policies": [
			("name", "VARCHAR(200)", "''"),
			("provider", "VARCHAR(200)", "''"),
			("policy_type", "VARCHAR(80)", "''"),
			("coverage_amount", "DOUBLE PRECISION", "0"),
			("premium_amount", "DOUBLE PRECISION", "0"),
			("claim_ratio", "DOUBLE PRECISION", "0"),
			("risk_level", "VARCHAR(20)", "'Low'"),
			("is_active", "BOOLEAN", "TRUE"),
			("user_id", "INTEGER", "NULL"),
			("created_at", "TIMESTAMP", "CURRENT_TIMESTAMP"),
		],
		"claims": [
			("claim_type", "VARCHAR(80)", "'General'"),
			("amount", "DOUBLE PRECISION", "0"),
			("risk_level", "VARCHAR(20)", "'Low'"),
			("status", "VARCHAR(40)", "'pending'"),
			("user_id", "INTEGER", "NULL"),
			("policy_id", "INTEGER", "NULL"),
			("created_at", "TIMESTAMP", "CURRENT_TIMESTAMP"),
		],
		"fraud_rules": [
			("name", "VARCHAR(200)", "''"),
			("condition", "VARCHAR(300)", "''"),
			("severity", "VARCHAR(20)", "'Medium'"),
			("is_active", "BOOLEAN", "TRUE"),
			("created_at", "TIMESTAMP", "CURRENT_TIMESTAMP"),
		],
	}

	with engine.begin() as connection:
		for table_name, columns in column_plan.items():
			if table_name not in inspector.get_table_names():
				continue

			existing_columns = {column["name"] for column in inspector.get_columns(table_name)}
			for column_name, sql_type, default_value in columns:
				if column_name in existing_columns:
					continue

				statement = (
					f"ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS {column_name} "
					f"{sql_type} DEFAULT {default_value}"
				)
				connection.execute(text(statement))
