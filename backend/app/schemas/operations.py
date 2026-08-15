from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

# ─── Attendance ───────────────────────────────────────────────────────────────

class AttendanceBase(BaseModel):
    student_id: str
    subject_id: str
    date: date
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: str
    student_name: Optional[str] = None
    subject_name: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Study Materials ──────────────────────────────────────────────────────────

class StudyMaterialBase(BaseModel):
    title: str
    subject_id: str

class StudyMaterialCreate(StudyMaterialBase):
    pass

class StudyMaterialResponse(StudyMaterialBase):
    id: str
    type: str
    url: str
    uploaded_by: str
    uploaded_at: datetime
    size: Optional[str] = None
    file_name: Optional[str] = None
    subject_name: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Assignments ──────────────────────────────────────────────────────────────

class AssignmentBase(BaseModel):
    title: str
    subject_id: str
    due_date: datetime
    max_marks: float
    description: Optional[str] = None

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentResponse(AssignmentBase):
    id: str
    faculty_id: str
    subject_name: Optional[str] = None
    faculty_name: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Submissions ──────────────────────────────────────────────────────────────

class SubmissionBase(BaseModel):
    assignment_id: str

class GradeSubmission(BaseModel):
    marks_obtained: float
    feedback: Optional[str] = None

class SubmissionResponse(SubmissionBase):
    id: str
    student_id: str
    student_name: Optional[str] = None
    roll_no: Optional[str] = None
    submitted_at: datetime
    file_name: str
    file_size: Optional[str] = None
    file_url: str
    status: str
    marks_obtained: Optional[float] = None
    feedback: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Results ──────────────────────────────────────────────────────────────────

class ResultBase(BaseModel):
    student_id: str
    subject_id: str
    internal_marks: Optional[float] = 0.0
    practical_marks: Optional[float] = 0.0
    external_marks: Optional[float] = 0.0
    published: Optional[bool] = False

class ResultCreate(ResultBase):
    pass

class ResultResponse(ResultBase):
    id: str
    student_name: Optional[str] = None
    subject_name: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Notices ──────────────────────────────────────────────────────────────────

class NoticeBase(BaseModel):
    title: str
    content: str
    type: str
    priority: Optional[str] = "low"

class NoticeCreate(NoticeBase):
    pass

class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    priority: Optional[str] = None

class NoticeResponse(NoticeBase):
    id: str
    published_at: datetime
    published_by: str
    publisher_name: Optional[str] = None

    class Config:
        from_attributes = True

