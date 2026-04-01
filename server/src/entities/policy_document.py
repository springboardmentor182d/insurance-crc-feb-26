from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.database.core import Base


class PolicyDocument(Base):
    __tablename__ = "policy_documents"

    id = Column(Integer, primary_key=True, index=True)
    active_policy_id = Column(
        Integer, ForeignKey("active_policies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    uploaded_by_user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False, index=True
    )
    file_name = Column(String(255), nullable=False)
    content_type = Column(String(128), nullable=False)
    file_size = Column(Integer, nullable=False)
    storage_provider = Column(String(32), nullable=False, default="local")
    storage_key = Column(String(512), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    active_policy = relationship("ActivePolicy", back_populates="documents")
