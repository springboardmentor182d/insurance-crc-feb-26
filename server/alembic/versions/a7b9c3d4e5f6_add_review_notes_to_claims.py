"""add_review_notes_to_claims

Revision ID: a7b9c3d4e5f6
Revises: d4b8e6f1a2c3
Create Date: 2026-04-01 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a7b9c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "d4b8e6f1a2c3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("claims", sa.Column("review_notes", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("claims", "review_notes")
