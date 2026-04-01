from __future__ import annotations

from datetime import date
from uuid import uuid4

from src.auth.models import RegisterRequest
from src.auth.service import AuthService
from src.database.admin_dashboard.models.users import User
from src.database.core import SessionLocal


def test_register_persists_date_of_birth(seeded_db) -> None:
    email = f"register-{uuid4().hex}@example.com"

    with SessionLocal() as session:
        try:
            response = AuthService(session).register(
                RegisterRequest(
                    name="Register Test",
                    email=email,
                    password="Password1",
                    date_of_birth=date(2000, 1, 15),
                )
            )

            created_user = session.query(User).filter(User.email == email).first()

            assert response.user.email == email
            assert created_user is not None
            assert created_user.date_of_birth == date(2000, 1, 15)
        finally:
            created_user = session.query(User).filter(User.email == email).first()
            if created_user is not None:
                session.delete(created_user)
                session.commit()
