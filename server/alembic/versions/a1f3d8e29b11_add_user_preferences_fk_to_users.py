"""add_user_preferences_fk_to_users

Revision ID: a1f3d8e29b11
Revises: c7b2d67b9c01
Create Date: 2026-03-17 01:30:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a1f3d8e29b11"
down_revision: Union[str, Sequence[str], None] = "c7b2d67b9c01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

FK_NAME = "fk_user_preferences_user_id_users"
SOURCE_TABLE = "user_preferences"
TARGET_TABLE = "users"


def _has_fk(bind) -> bool:
    inspector = sa.inspect(bind)
    if SOURCE_TABLE not in inspector.get_table_names():
        return False

    return any(
        fk.get("name") == FK_NAME
        for fk in inspector.get_foreign_keys(SOURCE_TABLE)
    )


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = set(inspector.get_table_names())

    # Keep migration idempotent for environments where table creation order differed.
    if SOURCE_TABLE in tables and TARGET_TABLE in tables and not _has_fk(bind):
        op.create_foreign_key(
            FK_NAME,
            SOURCE_TABLE,
            TARGET_TABLE,
            ["user_id"],
            ["id"],
        )


def downgrade() -> None:
    bind = op.get_bind()
    if _has_fk(bind):
        op.drop_constraint(FK_NAME, SOURCE_TABLE, type_="foreignkey")

