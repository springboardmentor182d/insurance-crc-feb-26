import os
import sys
from pathlib import Path


# Ensure src package imports work when running tests from server root.
SERVER_ROOT = Path(__file__).resolve().parents[1]
if str(SERVER_ROOT) not in sys.path:
	sys.path.insert(0, str(SERVER_ROOT))


def pytest_configure():
	os.environ.setdefault("PYTHONHASHSEED", "0")
