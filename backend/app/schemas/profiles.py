from pydantic import BaseModel, EmailStr
from typing import Optional

# ─── Student Schemas ──────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    roll_no: str
    phone: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    section: Optional[str] = None
    batch: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    roll_no: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    section: Optional[str] = None
    batch: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class StudentResponse(StudentCreate):
    user_id: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Faculty Schemas ──────────────────────────────────────────────────────────

class FacultyCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    experience: Optional[str] = None

class FacultyUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    experience: Optional[str] = None

class FacultyResponse(FacultyCreate):
    user_id: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Admin Profile Schemas ───────────────────────────────────────────────────

class AdminProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class AdminProfileResponse(BaseModel):
    user_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Creation Result Schemas (Includes generated credentials) ───────────────────

class CreatedUserCredentials(BaseModel):
    username: str
    password: str

class StudentCreatedResponse(BaseModel):
    student: StudentResponse
    credentials: CreatedUserCredentials

class FacultyCreatedResponse(BaseModel):
    faculty: FacultyResponse
    credentials: CreatedUserCredentials

