import pytest


@pytest.mark.skip(reason="E2E auth tests require running API server and seeded database")
def test_auth_endpoints_placeholder():
	assert True
