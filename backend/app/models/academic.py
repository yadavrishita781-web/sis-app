from sqlalchemy import Column, String, Integer, ForeignKey, Time
from sqlalchemy.orm import relationship
from app.database.base_class import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    hod_id = Column(String, ForeignKey("faculty_profiles.user_id"), nullable=True)

    hod = relationship("FacultyProfile")
    subjects = relationship("Subject", back_populates="department_rel")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    credits = Column(Integer, nullable=False)
    department_id = Column(String, ForeignKey("departments.id"))
    semester = Column(Integer)
    faculty_id = Column(String, ForeignKey("faculty_profiles.user_id"), nullable=True)

    department_rel = relationship("Department", back_populates="subjects")
    faculty = relationship("FacultyProfile")
    timetable_slots = relationship("Timetable", back_populates="subject_rel")

class Timetable(Base):
    __tablename__ = "timetable"

    id = Column(String, primary_key=True, index=True)
    day = Column(String, nullable=False) # e.g., Monday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id"), nullable=False)
    room = Column(String, nullable=False)

    subject_rel = relationship("Subject", back_populates="timetable_slots")
