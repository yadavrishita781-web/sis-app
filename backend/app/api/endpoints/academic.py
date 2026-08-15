from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_admin, get_current_user
from app.schemas.academic import (
    DepartmentCreate, DepartmentUpdate, DepartmentResponse, 
    SubjectCreate, SubjectUpdate, SubjectResponse, 
    TimetableSlotCreate, TimetableSlotUpdate, TimetableSlotResponse
)
from app.models.academic import Department, Subject, Timetable
from app.models.profiles import FacultyProfile
from app.models.user import User
from app.utils.auth_utils import generate_uuid

router = APIRouter()

# ─── Departments ──────────────────────────────────────────────────────────────

@router.post("/departments", response_model=DepartmentResponse)
def create_department(
    dept_in: DepartmentCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    if db.query(Department).filter(Department.code == dept_in.code).first():
        raise HTTPException(status_code=400, detail="Department code already exists")
    
    new_dept = Department(
        id=generate_uuid(),
        **dept_in.model_dump()
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept

@router.get("/departments", response_model=List[DepartmentResponse])
def get_departments(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Department).offset(skip).limit(limit).all()

@router.put("/departments/{id}", response_model=DepartmentResponse)
def update_department(
    id: str,
    dept_in: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
        
    for key, value in dept_in.model_dump(exclude_unset=True).items():
        setattr(dept, key, value)
        
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept

@router.delete("/departments/{id}")
def delete_department(
    id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    db.delete(dept)
    db.commit()
    return {"message": "Department deleted successfully"}

# ─── Subjects ─────────────────────────────────────────────────────────────────

@router.post("/subjects", response_model=SubjectResponse)
def create_subject(
    subject_in: SubjectCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    if db.query(Subject).filter(Subject.code == subject_in.code).first():
        raise HTTPException(status_code=400, detail="Subject code already exists")
    
    new_subject = Subject(
        id=generate_uuid(),
        **subject_in.model_dump()
    )
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject

@router.get("/subjects", response_model=List[SubjectResponse])
def get_subjects(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subjects = db.query(Subject).offset(skip).limit(limit).all()
    for sub in subjects:
        if sub.faculty:
            sub.faculty_name = sub.faculty.name
    return subjects

@router.put("/subjects/{id}", response_model=SubjectResponse)
def update_subject(
    id: str,
    subject_in: SubjectUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    subject = db.query(Subject).filter(Subject.id == id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    for key, value in subject_in.model_dump(exclude_unset=True).items():
        setattr(subject, key, value)
        
    db.add(subject)
    db.commit()
    db.refresh(subject)
    if subject.faculty:
        subject.faculty_name = subject.faculty.name
    return subject

@router.delete("/subjects/{id}")
def delete_subject(
    id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    subject = db.query(Subject).filter(Subject.id == id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

# ─── Timetable ────────────────────────────────────────────────────────────────

@router.post("/timetable", response_model=TimetableSlotResponse)
def create_timetable_slot(
    slot_in: TimetableSlotCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    new_slot = Timetable(
        id=generate_uuid(),
        **slot_in.model_dump()
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.get("/timetable", response_model=List[TimetableSlotResponse])
def get_timetable(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    slots = db.query(Timetable).offset(skip).limit(limit).all()
    for slot in slots:
        if slot.subject_rel:
            slot.subject_name = slot.subject_rel.name
            if slot.subject_rel.department_rel:
                slot.department = slot.subject_rel.department_rel.name
            slot.semester = slot.subject_rel.semester
            if slot.subject_rel.faculty:
                slot.faculty_name = slot.subject_rel.faculty.name
    return slots

@router.put("/timetable/{id}", response_model=TimetableSlotResponse)
def update_timetable_slot(
    id: str,
    slot_in: TimetableSlotUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    slot = db.query(Timetable).filter(Timetable.id == id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Timetable slot not found")
        
    for key, value in slot_in.model_dump(exclude_unset=True).items():
        setattr(slot, key, value)
        
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

@router.delete("/timetable/{id}")
def delete_timetable_slot(
    id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    slot = db.query(Timetable).filter(Timetable.id == id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Timetable slot not found")
    db.delete(slot)
    db.commit()
    return {"message": "Timetable slot deleted successfully"}

