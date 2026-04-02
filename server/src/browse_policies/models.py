from decimal import Decimal
from typing import List, Optional, Union

from pydantic import BaseModel, ConfigDict, field_validator


class PolicyCatalogResponse(BaseModel):
    """API shape for browse catalog rows (backed by `catalog_policies` in PostgreSQL)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    insurer_name: str
    category: str
    premium_annual: Decimal
    coverage_amount: Decimal
    deductible_amount: Optional[Decimal] = None
    average_rating: Optional[Decimal] = None
    rating_count: Optional[int] = None
    tagline: Optional[str] = None
    key_features: Optional[List[str]] = None

    @field_validator("key_features", mode="before")
    @classmethod
    def key_features_to_list(cls, v: Union[str, List[str], None]) -> Optional[List[str]]:
        """DB stores comma-separated text; API always returns a list (or null)."""
        if v is None:
            return None
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            return [f.strip() for f in v.split(",") if f.strip()]
        return None


class PolicyFilter(BaseModel):
    search: Optional[str] = None
    category: Optional[str] = None
