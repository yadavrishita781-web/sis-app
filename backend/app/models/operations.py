from sqlalchemy import Column, String, Integer, ForeignKey, Date, DateTime, Float, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base_class import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("student_profiles.user_id"), nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False) # present, absent, late

    student = relationship("StudentProfile")
    subject = relationship("Subject")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id"), nullable=False)
    faculty_id = Column(String, ForeignKey("faculty_profiles.user_id"), nullable=False)
    due_date = Column(DateTime, nullable=False)
    max_marks = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String, nullable=True)
    file_name = Column(String, nullable=True)

    subject = relationship("Subject")
    faculty = relationship("FacultyProfile")
    submissions = relationship("AssignmentSubmission", back_populates="assignment")

class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(String, primary_key=True, index=True)
    assignment_id = Column(String, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(String, ForeignKey("student_profiles.user_id"), nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    file_name = Column(String, nullable=False)
    file_size = Column(String, nullable=True)
    file_url = Column(String, nullable=False)
    status = Column(String, default="submitted") # submitted, graded
    marks_obtained = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("StudentProfile")

class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id"), nullable=False)
    type = Column(String, nullable=False) # pdf, ppt, docx, zip, video, link
    url = Column(String, nullable=False)
    uploaded_by = Column(String, ForeignKey("faculty_profiles.user_id"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    size = Column(String, nullable=True)
    file_name = Column(String, nullable=True)

    subject = relationship("Subject")
    uploader = relationship("FacultyProfile")

class Result(Base):
    __tablename__ = "results"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("student_profiles.user_id"), nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id"), nullable=False)
    internal_marks = Column(Float, default=0.0)
    practical_marks = Column(Float, default=0.0)
    external_marks = Column(Float, default=0.0)
    published = Column(Boolean, default=False)

    student = relationship("StudentProfile")
    subject = relationship("Subject")

class Notice(Base):
    __tablename__ = "notices"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String, nullable=False) # college, department, exam
    priority = Column(String, default="low") # high, medium, low
    published_at = Column(DateTime, default=datetime.utcnow)
    published_by = Column(String, ForeignKey("users.id"), nullable=False)

    publisher = relationship("User")
