from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# IMPORTANT: use your real password postgres123
DATABASE_URL = "postgresql://postgres:postgres123@localhost:5432/insurelogic"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
