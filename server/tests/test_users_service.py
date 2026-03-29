from __future__ import annotations

from datetime import date
from uuid import uuid4

from src.database.admin_dashboard.models.users import User, UserRole
from src.database.core import SessionLocal
from src.users.models import ProfileBase
from src.users.service import get_user_profile, update_user_profile


def test_update_user_profile_persists_extended_fields(seeded_db) -> None:
    email = f"profile-{uuid4().hex}@example.com"

    with SessionLocal() as session:
        user = User(
            email=email,
            full_name="Profile Test User",
            first_name="Profile",
            last_name="User",
            role=UserRole.CUSTOMER,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        user_id = user.id

        try:
            updated = update_user_profile(
                session,
                user_id,
                ProfileBase(
                    first_name="Priya",
                    last_name="Sharma",
                    phone="+91 9876543210",
                    date_of_birth=date(1998, 5, 12),
                    occupation="Software Engineer",
                    address="221B MG Road",
                    city="Bengaluru",
                    state="Karnataka",
                    zip_code="560001",
                    insurance_preferences={
                        "auto": True,
                        "home": False,
                        "life": True,
                        "health": True,
                    },
                ),
            )

            assert updated.full_name == "Priya Sharma"
            assert updated.date_of_birth == date(1998, 5, 12)
            assert updated.occupation == "Software Engineer"
            assert updated.address == "221B MG Road"
            assert updated.city == "Bengaluru"
            assert updated.state == "Karnataka"
            assert updated.zip_code == "560001"
            assert updated.insurance_preferences == {
                "auto": True,
                "home": False,
                "life": True,
                "health": True,
            }

            fetched = get_user_profile(session, user_id)
            assert fetched is not None
            assert fetched.date_of_birth == date(1998, 5, 12)
            assert fetched.occupation == "Software Engineer"
            assert fetched.address == "221B MG Road"
            assert fetched.insurance_preferences["health"] is True
        finally:
            session.delete(session.get(User, user_id))
            session.commit()
