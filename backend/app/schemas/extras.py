from pydantic import BaseModel
from typing import Optional
from datetime import date

# ─── Fees ─────────────────────────────────────────────────────────────────────

class FeeBase(BaseModel):
    student_id: str
    type: str
    amount: float
    status: Optional[str] = "pending"
    due_date: date
    paid_date: Optional[date] = None
    receipt_no: Optional[str] = None

class FeeCreate(FeeBase):
    pass

class FeeUpdate(BaseModel):
    student_id: Optional[str] = None
    type: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    due_date: Optional[date] = None
    paid_date: Optional[date] = None
    receipt_no: Optional[str] = None

class FeeResponse(FeeBase):
    id: str
    student_name: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Leave Applications ───────────────────────────────────────────────────────

class LeaveCreate(BaseModel):
    type: str
    from_date: str
    to_date: str
    reason: str

class LeaveStatusUpdate(BaseModel):
    status: str # approved, rejected

class LeaveResponse(BaseModel):
    id: str
    applicant_id: str
    applicant_name: Optional[str] = None
    type: str
    from_date: str
    to_date: str
    reason: str
    status: str
    applied_at: Optional[str] = None
    reviewed_by: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Profile & Auth ───────────────────────────────────────────────────────────

class StudentProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

