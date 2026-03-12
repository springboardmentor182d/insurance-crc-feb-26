"""add_first_and_last_name_to_users

Revision ID: c7b2d67b9c01
Revises: 4f05c9bbbab9
Create Date: 2026-03-02 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c7b2d67b9c01"
down_revision: Union[str, Sequence[str], None] = "4f05c9bbbab9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("first_name", sa.String(length=60), nullable=True))
    op.add_column("users", sa.Column("last_name", sa.String(length=60), nullable=True))

    # Best-effort backfill from full_name for existing rows.
    op.execute("""
        UPDATE users
        SET
            first_name = NULLIF(split_part(full_name, ' ', 1), ''),
            last_name = NULLIF(NULLIF(trim(substr(full_name, strpos(full_name || ' ', ' ') + 1)), ''), first_name)
        WHERE full_name IS NOT NULL;
    """)


def downgrade() -> None:
    op.drop_column("users", "last_name")
    op.drop_column("users", "first_name")
