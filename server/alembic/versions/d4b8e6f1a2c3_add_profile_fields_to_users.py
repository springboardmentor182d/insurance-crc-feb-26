"""add_profile_fields_to_users

Revision ID: d4b8e6f1a2c3
Revises: 2f8c6e1b4a9d
Create Date: 2026-03-29 21:30:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d4b8e6f1a2c3"
down_revision: Union[str, Sequence[str], None] = "2f8c6e1b4a9d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("date_of_birth", sa.Date(), nullable=True))
    op.add_column("users", sa.Column("gender", sa.String(length=30), nullable=True))
    op.add_column("users", sa.Column("address", sa.String(length=255), nullable=True))
    op.add_column("users", sa.Column("city", sa.String(length=100), nullable=True))
    op.add_column("users", sa.Column("state", sa.String(length=100), nullable=True))
    op.add_column("users", sa.Column("zip_code", sa.String(length=20), nullable=True))
    op.add_column("users", sa.Column("country", sa.String(length=100), nullable=True))
    op.add_column("users", sa.Column("occupation", sa.String(length=120), nullable=True))
    op.add_column("users", sa.Column("company", sa.String(length=120), nullable=True))
    op.add_column("users", sa.Column("insurance_preferences", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "insurance_preferences")
    op.drop_column("users", "company")
    op.drop_column("users", "occupation")
    op.drop_column("users", "country")
    op.drop_column("users", "zip_code")
    op.drop_column("users", "state")
    op.drop_column("users", "city")
    op.drop_column("users", "address")
    op.drop_column("users", "gender")
    op.drop_column("users", "date_of_birth")
