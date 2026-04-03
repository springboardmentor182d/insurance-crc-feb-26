from celery import Celery
from src.core.config import settings

celery_app = Celery("insurehub", broker=settings.REDIS_URL, backend=settings.REDIS_URL)
