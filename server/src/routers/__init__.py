# This file makes the routers directory a Python package
from .admin import router as admin
from .catalog import router as catalog

__all__ = ["admin", "catalog"]