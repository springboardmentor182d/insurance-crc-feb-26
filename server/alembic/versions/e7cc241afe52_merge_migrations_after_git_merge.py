"""merge migrations after git merge

Revision ID: e7cc241afe52
Revises: a7b9c3d4e5f6, b83263ab65c0
Create Date: 2026-04-02 17:57:37.276144

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e7cc241afe52'
down_revision: Union[str, Sequence[str], None] = ('a7b9c3d4e5f6', 'b83263ab65c0')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
