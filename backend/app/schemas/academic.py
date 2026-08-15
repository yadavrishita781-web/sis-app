from pydantic import BaseModel
from typing import Optional, List
from datetime import time

# ─── Department ───────────────────────────────────────────────────────────────

class DepartmentBase(BaseModel):
    name: str
    code: str
    hod_id: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    hod_id: Optional[str] = None

class DepartmentResponse(DepartmentBase):
    id: str
    total_students: Optional[int] = 0
    total_faculty: Optional[int] = 0

    class Config:
        from_attributes = True

# ─── Subject ──────────────────────────────────────────────────────────────────

class SubjectBase(BaseModel):
    name: str
    code: str
    credits: int
    department_id: str
    semester: int
    faculty_id: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    department_id: Optional[str] = None
    semester: Optional[int] = None
    faculty_id: Optional[str] = None

class SubjectResponse(SubjectBase):
    id: str
    faculty_name: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Timetable ────────────────────────────────────────────────────────────────

class TimetableSlotBase(BaseModel):
    day: str
    start_time: time
    end_time: time
    subject_id: str
    room: str

class TimetableSlotCreate(TimetableSlotBase):
    pass

class TimetableSlotUpdate(BaseModel):
    day: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    subject_id: Optional[str] = None
    room: Optional[str] = None

class TimetableSlotResponse(TimetableSlotBase):
    id: str
    subject_name: Optional[str] = None
    faculty_name: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None

    class Config:
        from_attributes = True

