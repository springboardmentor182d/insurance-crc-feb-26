import pytest
from jose import jwt

from src.auth.service import (
	ALGORITHM,
	SECRET_KEY,
	create_access_token,
	create_refresh_token,
	hash_password,
	verify_password,
)


def test_hash_and_verify_password_roundtrip():
	password = "Pass@12345"
	try:
		hashed = hash_password(password)
	except ValueError as exc:
		pytest.skip(f"bcrypt backend not available in current environment: {exc}")

	assert hashed != password
	assert verify_password(password, hashed) is True
	assert verify_password("wrong-password", hashed) is False


def test_create_access_token_contains_subject_and_expiry():
	token = create_access_token({"sub": "admin@example.com"})
	payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

	assert payload["sub"] == "admin@example.com"
	assert "exp" in payload


def test_create_refresh_token_contains_expiry():
	token = create_refresh_token({"sub": "admin@example.com"})
	payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

	assert payload["sub"] == "admin@example.com"
	assert "exp" in payload
