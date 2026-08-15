from sqlalchemy import Column, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database.base_class import Base

class Fee(Base):
    __tablename__ = "fees"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("student_profiles.user_id"), nullable=False)
    type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending") # paid, pending, overdue
    due_date = Column(Date, nullable=False)
    paid_date = Column(Date, nullable=True)
    receipt_no = Column(String, nullable=True)

    student = relationship("StudentProfile")
