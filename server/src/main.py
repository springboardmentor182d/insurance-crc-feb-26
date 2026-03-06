from src.api import app
from src.database.core import engine, Base
from src.entities.user import User

Base.metadata.create_all(bind=engine)