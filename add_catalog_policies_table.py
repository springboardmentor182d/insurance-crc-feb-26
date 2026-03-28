"""add_catalog_policies_table

Revision ID: b8e4a1f0c2d3
Revises: 9c2f3a1c7c4b
Create Date: 2026-03-28 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b8e4a1f0c2d3"
down_revision: Union[str, Sequence[str], None] = "9c2f3a1c7c4b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "catalog_policies",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("insurer_name", sa.String(), nullable=False),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("premium_annual", sa.Numeric(10, 2), nullable=False),
        sa.Column("coverage_amount", sa.Numeric(14, 2), nullable=False),
        sa.Column("deductible_amount", sa.Numeric(10, 2), nullable=True),
        sa.Column("average_rating", sa.Numeric(2, 1), nullable=True),
        sa.Column("rating_count", sa.Integer(), nullable=True),
        sa.Column("tagline", sa.String(), nullable=True),
        sa.Column("key_features", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_catalog_policies_id"), "catalog_policies", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_catalog_policies_id"), table_name="catalog_policies")
    op.drop_table("catalog_policies")
