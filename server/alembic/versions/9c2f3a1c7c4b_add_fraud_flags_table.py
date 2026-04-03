"""add_fraud_flags_table

Revision ID: 9c2f3a1c7c4b
Revises: c7b2d67b9c01
Create Date: 2026-03-17 02:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "9c2f3a1c7c4b"
down_revision: Union[str, Sequence[str], None] = "c7b2d67b9c01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # FIX: create_type=False assumed the 'fraud_severity' ENUM already existed in
    # the database, but no prior migration creates it. This caused:
    #   ProgrammingError: type "fraud_severity" does not exist
    # Solution: explicitly create the type before the table, then use create_type=False
    # so SQLAlchemy does not attempt a redundant CREATE TYPE inline during table creation.
    op.execute("""
DO $$ BEGIN
    CREATE TYPE fraud_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
""")
    op.add_column(
        "fraud_rules",
        sa.Column("trigger_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_table(
        "fraud_flags",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("claim_id", sa.Integer(), nullable=False),
        sa.Column("rule_id", sa.Integer(), nullable=False),
        sa.Column("rule_name", sa.String(length=120), nullable=False),
        sa.Column(
            "severity",
            postgresql.ENUM(
                "LOW",
                "MEDIUM",
                "HIGH",
                name="fraud_severity",
                create_type=False,  # type is already created above
            ),
            nullable=False,
        ),
        sa.Column("details", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["claim_id"], ["claims.id"]),
        sa.ForeignKeyConstraint(["rule_id"], ["fraud_rules.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_fraud_flags_claim_id", "fraud_flags", ["claim_id"], unique=False)
    op.create_index("ix_fraud_flags_rule_id", "fraud_flags", ["rule_id"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_fraud_flags_rule_id", table_name="fraud_flags")
    op.drop_index("ix_fraud_flags_claim_id", table_name="fraud_flags")
    op.drop_table("fraud_flags")
    op.drop_column("fraud_rules", "trigger_count")
    # FIX: The original downgrade did not drop the ENUM type, leaving an orphaned
    # PostgreSQL type behind after rollback. Drop it after the table is gone.
    op.execute("DROP TYPE fraud_severity")