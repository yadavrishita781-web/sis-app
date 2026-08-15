from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_admin
from app.schemas.profiles import (
    StudentCreate, StudentUpdate, StudentCreatedResponse, 
    FacultyCreate, FacultyUpdate, FacultyCreatedResponse, 
    StudentResponse, FacultyResponse
)
from app.services import admin_service
from app.models.profiles import StudentProfile, FacultyProfile
from app.models.academic import Department, Subject
from app.models.operations import Attendance, Notice
from app.models.extras import Fee
from app.models.user import User

router = APIRouter()

# ─── Stats / Dashboard ────────────────────────────────────────────────────────

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    total_students = db.query(StudentProfile).count()
    total_faculty = db.query(FacultyProfile).count()
    total_departments = db.query(Department).count()
    total_subjects = db.query(Subject).count()
    
    attendance_records = db.query(Attendance).all()
    present_count = sum(1 for a in attendance_records if a.status == 'present')
    avg_attendance = round((present_count / len(attendance_records) * 100), 1) if attendance_records else 85.0
    
    fees = db.query(Fee).all()
    fees_collected = sum(f.amount for f in fees if f.status == 'paid')
    pending_fees = sum(f.amount for f in fees if f.status == 'pending')
    overdue_fees = sum(f.amount for f in fees if f.status == 'overdue')
    
    active_notices = db.query(Notice).count()
    
    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_departments": total_departments,
        "total_subjects": total_subjects,
        "avg_attendance": avg_attendance,
        "fees_collected": fees_collected,
        "pending_fees": pending_fees,
        "overdue_fees": overdue_fees,
        "active_notices": active_notices
    }

# ─── Students ─────────────────────────────────────────────────────────────────

@router.post("/students", response_model=StudentCreatedResponse)
def create_student(
    student_in: StudentCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return admin_service.create_student(db, student_in)

@router.get("/students", response_model=List[StudentResponse])
def get_students(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return db.query(StudentProfile).offset(skip).limit(limit).all()

@router.put("/students/{user_id}", response_model=StudentResponse)
def update_student(
    user_id: str,
    student_in: StudentUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student not found")
        
    update_data = student_in.model_dump(exclude_unset=True)
    if "email" in update_data:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.email = update_data.pop("email")
            db.add(user)
            
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.delete("/students/{user_id}")
def delete_student(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    user = db.query(User).filter(User.id == user_id).first()
    if not profile and not user:
        raise HTTPException(status_code=404, detail="Student not found")
        
    if profile:
        db.delete(profile)
    if user:
        db.delete(user)
    db.commit()
    return {"message": "Student deleted successfully"}

# ─── Faculty ──────────────────────────────────────────────────────────────────

@router.post("/faculty", response_model=FacultyCreatedResponse)
def create_faculty(
    faculty_in: FacultyCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return admin_service.create_faculty(db, faculty_in)

@router.get("/faculty", response_model=List[FacultyResponse])
def get_faculty(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return db.query(FacultyProfile).offset(skip).limit(limit).all()

@router.put("/faculty/{user_id}", response_model=FacultyResponse)
def update_faculty(
    user_id: str,
    faculty_in: FacultyUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    profile = db.query(FacultyProfile).filter(FacultyProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Faculty not found")
        
    update_data = faculty_in.model_dump(exclude_unset=True)
    if "email" in update_data:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.email = update_data.pop("email")
            db.add(user)
            
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.delete("/faculty/{user_id}")
def delete_faculty(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    profile = db.query(FacultyProfile).filter(FacultyProfile.user_id == user_id).first()
    user = db.query(User).filter(User.id == user_id).first()
    if not profile and not user:
        raise HTTPException(status_code=404, detail="Faculty not found")
        
    if profile:
        db.delete(profile)
    if user:
        db.delete(user)
    db.commit()
    return {"message": "Faculty deleted successfully"}

