from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.database.core import Base


class ClaimDocument(Base):
    __tablename__ = "claim_documents"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(
        Integer, ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True
    )
    file_name = Column(String(255), nullable=False)
    content_type = Column(String(128), nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    storage_key = Column(String(512), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    claim = relationship("Claim", back_populates="documents")
