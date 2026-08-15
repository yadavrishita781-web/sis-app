from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user, get_current_faculty, get_current_admin
from app.schemas.operations import (
    AttendanceCreate, AttendanceResponse, 
    StudyMaterialCreate, StudyMaterialResponse,
    AssignmentCreate, AssignmentResponse,
    SubmissionResponse, GradeSubmission,
    ResultCreate, ResultResponse,
    NoticeCreate, NoticeUpdate, NoticeResponse
)
from app.models.operations import Attendance, StudyMaterial, Assignment, AssignmentSubmission, Result, Notice
from app.models.academic import Subject
from app.models.profiles import StudentProfile, FacultyProfile
from app.models.user import User, RoleEnum
from app.utils.auth_utils import generate_uuid
from app.utils.file_manager import save_upload_file, delete_file
import os

router = APIRouter()

# ─── Attendance ───────────────────────────────────────────────────────────────

@router.post("/attendance", response_model=List[AttendanceResponse])
def mark_attendance(
    attendance_records: List[AttendanceCreate],
    db: Session = Depends(get_db),
    current_faculty: User = Depends(get_current_faculty)
):
    created_records = []
    for record in attendance_records:
        new_record = Attendance(id=generate_uuid(), **record.model_dump())
        db.add(new_record)
        created_records.append(new_record)
    db.commit()
    for record in created_records:
        db.refresh(record)
        if record.student:
            record.student_name = record.student.name
        if record.subject:
            record.subject_name = record.subject.name
    return created_records

@router.get("/attendance", response_model=List[AttendanceResponse])
def get_attendance(
    student_id: Optional[str] = None,
    subject_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Attendance)
    if current_user.role == RoleEnum.student:
        query = query.filter(Attendance.student_id == current_user.id)
    elif student_id:
        query = query.filter(Attendance.student_id == student_id)
        
    if subject_id:
        query = query.filter(Attendance.subject_id == subject_id)
        
    records = query.all()
    for record in records:
        if record.student:
            record.student_name = record.student.name
        if record.subject:
            record.subject_name = record.subject.name
    return records

# ─── Study Materials ──────────────────────────────────────────────────────────

@router.post("/materials", response_model=StudyMaterialResponse)
def upload_study_material(
    title: str = Form(...),
    subject_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_faculty: User = Depends(get_current_faculty)
):
    _, ext = os.path.splitext(file.filename)
    file_type = ext.replace(".", "").lower()
    
    file_url = save_upload_file(file, subfolder="materials")
    
    new_material = StudyMaterial(
        id=generate_uuid(),
        title=title,
        subject_id=subject_id,
        type=file_type,
        url=file_url,
        uploaded_by=current_faculty.id,
        file_name=file.filename
    )
    db.add(new_material)
    db.commit()
    db.refresh(new_material)
    if new_material.subject:
        new_material.subject_name = new_material.subject.name
    return new_material

@router.get("/materials", response_model=List[StudyMaterialResponse])
def get_materials(
    subject_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(StudyMaterial)
    if subject_id:
        query = query.filter(StudyMaterial.subject_id == subject_id)
    materials = query.all()
    for mat in materials:
        if mat.subject:
            mat.subject_name = mat.subject.name
    return materials

@router.delete("/materials/{id}")
def delete_study_material(
    id: str,
    db: Session = Depends(get_db),
    current_faculty: User = Depends(get_current_faculty)
):
    material = db.query(StudyMaterial).filter(StudyMaterial.id == id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Study material not found")
    delete_file(material.url)
    db.delete(material)
    db.commit()
    return {"message": "Study material deleted successfully"}

# ─── Assignments ──────────────────────────────────────────────────────────────

@router.post("/assignments", response_model=AssignmentResponse)
def create_assignment(
    title: str = Form(...),
    subject_id: str = Form(...),
    due_date: str = Form(...),
    max_marks: float = Form(...),
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_faculty: User = Depends(get_current_faculty)
):
    from datetime import datetime
    file_url = None
    file_name = None
    if file:
        file_url = save_upload_file(file, subfolder="assignments")
        file_name = file.filename
        
    try:
        parsed_due_date = datetime.fromisoformat(due_date.replace("Z", "+00:00"))
    except Exception:
        parsed_due_date = datetime.utcnow()
    
    new_assignment = Assignment(
        id=generate_uuid(),
        title=title,
        subject_id=subject_id,
        faculty_id=current_faculty.id,
        due_date=parsed_due_date,
        max_marks=max_marks,
        description=description,
        file_url=file_url,
        file_name=file_name
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    if new_assignment.subject:
        new_assignment.subject_name = new_assignment.subject.name
    if new_assignment.faculty:
        new_assignment.faculty_name = new_assignment.faculty.name
    return new_assignment

@router.get("/assignments", response_model=List[AssignmentResponse])
def get_assignments(
    subject_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Assignment)
    if subject_id:
        query = query.filter(Assignment.subject_id == subject_id)
    assignments = query.all()
    for ass in assignments:
        if ass.subject:
            ass.subject_name = ass.subject.name
        if ass.faculty:
            ass.faculty_name = ass.faculty.name
    return assignments

@router.delete("/assignments/{id}")
def delete_assignment(
    id: str,
    db: Session = Depends(get_db),
    current_faculty: User = Depends(get_current_faculty)
):
    assignment = db.query(Assignment).filter(Assignment.id == id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if assignment.file_url:
        delete_file(assignment.file_url)
    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}

# ─── Submissions ──────────────────────────────────────────────────────────────

@router.post("/assignments/{assignment_id}/submit", response_model=SubmissionResponse)
def submit_assignment(
    assignment_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.student:
        raise HTTPException(status_code=403, detail="Only students can submit assignments")
        
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    existing_sub = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.assignment_id == assignment_id,
        AssignmentSubmission.student_id == current_user.id
    ).first()
    
    if existing_sub:
        delete_file(existing_sub.file_url)
        db.delete(existing_sub)
        db.commit()
        
    file_url = save_upload_file(file, subfolder="submissions")
    
    new_submission = AssignmentSubmission(
        id=generate_uuid(),
        assignment_id=assignment_id,
        student_id=current_user.id,
        file_name=file.filename,
        file_url=file_url
    )
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)
    return new_submission

@router.get("/assignments/{assignment_id}/submissions", response_model=List[SubmissionResponse])
def get_submissions(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_faculty: User = Depends(get_current_faculty)
):
    submissions = db.query(AssignmentSubmission).filter(AssignmentSubmission.assignment_id == assignment_id).all()
    for sub in submissions:
        if sub.student:
            sub.student_name = sub.student.name
            sub.roll_no = sub.student.roll_no
    return submissions

@router.post("/submissions/{submission_id}/grade", response_model=SubmissionResponse)
def grade_submission(
    submission_id: str,
    grade_in: GradeSubmission,
    db: Session = Depends(get_db),
    current_faculty: User = Depends(get_current_faculty)
):
    sub = db.query(AssignmentSubmission).filter(AssignmentSubmission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    sub.marks_obtained = grade_in.marks_obtained
    sub.feedback = grade_in.feedback
    sub.status = "graded"
    
    db.add(sub)
    db.commit()
    db.refresh(sub)
    if sub.student:
        sub.student_name = sub.student.name
        sub.roll_no = sub.student.roll_no
    return sub

# ─── Results ──────────────────────────────────────────────────────────────────

@router.post("/results", response_model=ResultResponse)
def submit_marks(
    result_in: ResultCreate,
    db: Session = Depends(get_db),
    current_faculty: User = Depends(get_current_faculty)
):
    existing = db.query(Result).filter(
        Result.student_id == result_in.student_id,
        Result.subject_id == result_in.subject_id
    ).first()
    
    if existing:
        existing.internal_marks = result_in.internal_marks
        existing.practical_marks = result_in.practical_marks
        existing.external_marks = result_in.external_marks
        existing.published = result_in.published
        db.add(existing)
        db.commit()
        db.refresh(existing)
        res = existing
    else:
        res = Result(
            id=generate_uuid(),
            **result_in.model_dump()
        )
        db.add(res)
        db.commit()
        db.refresh(res)
        
    if res.student:
        res.student_name = res.student.name
    if res.subject:
        res.subject_name = res.subject.name
    return res

@router.get("/results", response_model=List[ResultResponse])
def get_results(
    student_id: Optional[str] = None,
    subject_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Result)
    if current_user.role == RoleEnum.student:
        query = query.filter(Result.student_id == current_user.id, Result.published == True)
    elif student_id:
        query = query.filter(Result.student_id == student_id)
        
    if subject_id:
        query = query.filter(Result.subject_id == subject_id)
        
    results = query.all()
    for res in results:
        if res.student:
            res.student_name = res.student.name
        if res.subject:
            res.subject_name = res.subject.name
    return results

@router.post("/results/publish")
def publish_results(
    subject_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    query = db.query(Result)
    if subject_id:
        query = query.filter(Result.subject_id == subject_id)
    results = query.all()
    for res in results:
        res.published = True
        db.add(res)
    db.commit()
    return {"message": f"Published {len(results)} results successfully"}

# ─── Notices ──────────────────────────────────────────────────────────────────

@router.post("/notices", response_model=NoticeResponse)
def create_notice(
    notice_in: NoticeCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    new_notice = Notice(
        id=generate_uuid(),
        published_by=current_admin.id,
        **notice_in.model_dump()
    )
    db.add(new_notice)
    db.commit()
    db.refresh(new_notice)
    if new_notice.publisher:
        new_notice.publisher_name = new_notice.publisher.username
    return new_notice

@router.get("/notices", response_model=List[NoticeResponse])
def get_notices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notices = db.query(Notice).order_by(Notice.published_at.desc()).all()
    for n in notices:
        if n.publisher:
            n.publisher_name = n.publisher.username
    return notices

@router.put("/notices/{id}", response_model=NoticeResponse)
def update_notice(
    id: str,
    notice_in: NoticeUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    notice = db.query(Notice).filter(Notice.id == id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
        
    for key, value in notice_in.model_dump(exclude_unset=True).items():
        setattr(notice, key, value)
        
    db.add(notice)
    db.commit()
    db.refresh(notice)
    if notice.publisher:
        notice.publisher_name = notice.publisher.username
    return notice

@router.delete("/notices/{id}")
def delete_notice(
    id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    notice = db.query(Notice).filter(Notice.id == id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(notice)
    db.commit()
    return {"message": "Notice deleted successfully"}

