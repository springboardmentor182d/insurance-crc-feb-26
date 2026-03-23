from __future__ import annotations

import os
import smtplib
from email.message import EmailMessage

from sqlalchemy import select

from src.database.core import SessionLocal
from src.database.admin_dashboard.models import User, UserRole
from src.tasks.celery_app import celery_app


@celery_app.task
def notify_admin_high_severity_flag(claim_id: int, rule_name: str, claim_number: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"

    if not smtp_host or not smtp_user or not smtp_pass:
        return

    with SessionLocal() as session:
        admins = (
            session.execute(
                select(User).where(User.role == UserRole.ADMIN, User.is_active.is_(True))
            )
            .scalars()
            .all()
        )

    recipients = [admin.email for admin in admins if admin.email]
    if not recipients:
        return

    subject = f"High Severity Fraud Alert - Claim {claim_number}"
    body = (
        f"Rule triggered: {rule_name}\n"
        f"Claim: {claim_number}\n"
        "Review at /admin/flagged-claims"
    )

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = smtp_user
    message["To"] = ", ".join(recipients)
    message.set_content(body)

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        if use_tls:
            server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(message)
