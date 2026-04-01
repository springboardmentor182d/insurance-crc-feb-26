"""add_policy_documents_table

Revision ID: 2f8c6e1b4a9d
Revises: 9c2f3a1c7c4b
Create Date: 2026-03-28 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2f8c6e1b4a9d"
down_revision: Union[str, Sequence[str], None] = "9c2f3a1c7c4b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "policy_documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("active_policy_id", sa.Integer(), nullable=False),
        sa.Column("uploaded_by_user_id", sa.Integer(), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=128), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("storage_provider", sa.String(length=32), nullable=False),
        sa.Column("storage_key", sa.String(length=512), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["active_policy_id"], ["active_policies.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["uploaded_by_user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("storage_key"),
    )
    op.create_index("ix_policy_documents_active_policy_id", "policy_documents", ["active_policy_id"], unique=False)
    op.create_index("ix_policy_documents_uploaded_by_user_id", "policy_documents", ["uploaded_by_user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_policy_documents_uploaded_by_user_id", table_name="policy_documents")
    op.drop_index("ix_policy_documents_active_policy_id", table_name="policy_documents")
    op.drop_table("policy_documents")
