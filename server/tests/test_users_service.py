import pytest
from pydantic import ValidationError

from src.schemas import UserCreate, UserResponse


def test_user_create_accepts_valid_input():
	user = UserCreate(name="Aarav", email="aarav@example.com")

	assert user.name == "Aarav"
	assert user.email == "aarav@example.com"


def test_user_create_rejects_invalid_email():
	with pytest.raises(ValidationError):
		UserCreate(name="Aarav", email="not-an-email")


def test_user_response_shape():
	payload = {
		"id": 1,
		"name": "Aarav",
		"email": "aarav@example.com",
		"status": "Active",
	}
	user = UserResponse(**payload)

	assert user.id == 1
	assert user.status == "Active"
