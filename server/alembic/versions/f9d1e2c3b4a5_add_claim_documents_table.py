"""Add claim_documents table and relationship

Revision ID: f9d1e2c3b4a5
Revises: e7cc241afe52
Create Date: 2026-04-05 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f9d1e2c3b4a5"
down_revision: Union[str, Sequence[str], None] = "e7cc241afe52"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create claim_documents table
    op.create_table(
        "claim_documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("claim_id", sa.Integer(), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=128), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("storage_key", sa.String(length=512), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["claim_id"], ["claims.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("storage_key"),
    )
    op.create_index("ix_claim_documents_claim_id", "claim_documents", ["claim_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_claim_documents_claim_id", table_name="claim_documents")
    op.drop_table("claim_documents")
