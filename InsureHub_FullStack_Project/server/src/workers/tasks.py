from src.workers.celery_app import celery_app

@celery_app.task
def send_notification(email: str, message: str):
    print(f"Notification to {email}: {message}")
    return True
