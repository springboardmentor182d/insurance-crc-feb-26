"""
Compatibility wrapper.

Your dev command is often `uvicorn main:app` executed from the `server/` folder.
The actual FastAPI app lives in `server/src/main.py`.

This file dynamically loads that module and re-exports `app` so Uvicorn can import `main:app`.
"""

from __future__ import annotations

import importlib.util
import os

_THIS_DIR = os.path.dirname(__file__)
_SRC_MAIN_PATH = os.path.join(_THIS_DIR, "src", "main.py")

spec = importlib.util.spec_from_file_location("insurance_crc_src_main", _SRC_MAIN_PATH)
if spec is None or spec.loader is None:
    raise ImportError(f"Could not load FastAPI app from {_SRC_MAIN_PATH}")

_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_module)

app = _module.app

