from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base_class import Base

class LeaveApplication(Base):
    __tablename__ = "leave_applications"

    id = Column(String, primary_key=True, index=True)
    applicant_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False) # medical, casual, emergency
    from_date = Column(String, nullable=False)
    to_date = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, approved, rejected
    applied_at = Column(DateTime, default=datetime.utcnow)
    reviewed_by = Column(String, ForeignKey("users.id"), nullable=True)

    applicant = relationship("User", foreign_keys=[applicant_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])
