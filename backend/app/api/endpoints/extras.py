from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from datetime import date

from app.api.dependencies import get_db, get_current_user, get_current_admin
from app.schemas.extras import (
    FeeCreate, FeeUpdate, FeeResponse, 
    LeaveCreate, LeaveStatusUpdate, LeaveResponse,
    StudentProfileUpdate
)
from app.schemas.profiles import StudentResponse, FacultyResponse, FacultyUpdate, AdminProfileResponse, AdminProfileUpdate
from app.models.extras import Fee
from app.models.leave import LeaveApplication
from app.models.profiles import StudentProfile, FacultyProfile, AdminProfile
from app.models.user import User, RoleEnum
from app.utils.auth_utils import generate_uuid
from app.utils.file_manager import save_upload_file, delete_file

router = APIRouter()

# ─── Fees ─────────────────────────────────────────────────────────────────────

@router.post("/fees", response_model=FeeResponse)
def add_fee(
    fee_in: FeeCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    new_fee = Fee(
        id=generate_uuid(),
        **fee_in.model_dump()
    )
    db.add(new_fee)
    db.commit()
    db.refresh(new_fee)
    if new_fee.student:
        new_fee.student_name = new_fee.student.name
    return new_fee

@router.get("/fees", response_model=List[FeeResponse])
def get_fees(
    student_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Fee)
    if current_user.role == RoleEnum.student:
        query = query.filter(Fee.student_id == current_user.id)
    elif student_id:
        query = query.filter(Fee.student_id == student_id)
        
    fees = query.all()
    for fee in fees:
        if fee.student:
            fee.student_name = fee.student.name
    return fees

@router.put("/fees/{id}", response_model=FeeResponse)
def update_fee(
    id: str,
    fee_in: FeeUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    fee = db.query(Fee).filter(Fee.id == id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found")
        
    for key, value in fee_in.model_dump(exclude_unset=True).items():
        setattr(fee, key, value)
        
    db.add(fee)
    db.commit()
    db.refresh(fee)
    if fee.student:
        fee.student_name = fee.student.name
    return fee

@router.post("/fees/{id}/pay", response_model=FeeResponse)
def pay_fee(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    fee = db.query(Fee).filter(Fee.id == id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found")
        
    fee.status = "paid"
    fee.paid_date = date.today()
    fee.receipt_no = f"REC-{generate_uuid()[:8].upper()}"
    
    db.add(fee)
    db.commit()
    db.refresh(fee)
    if fee.student:
        fee.student_name = fee.student.name
    return fee

@router.delete("/fees/{id}")
def delete_fee(
    id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    fee = db.query(Fee).filter(Fee.id == id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found")
    db.delete(fee)
    db.commit()
    return {"message": "Fee record deleted successfully"}

# ─── Leave Applications ───────────────────────────────────────────────────────

@router.post("/leave", response_model=LeaveResponse)
def apply_leave(
    leave_in: LeaveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_leave = LeaveApplication(
        id=generate_uuid(),
        applicant_id=current_user.id,
        **leave_in.model_dump()
    )
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave

@router.get("/leave", response_model=List[LeaveResponse])
def get_leave_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(LeaveApplication)
    if current_user.role == RoleEnum.student:
        query = query.filter(LeaveApplication.applicant_id == current_user.id)
    elif current_user.role == RoleEnum.faculty:
        # Faculty sees own leaves and leaves submitted by students
        query = query.filter(
            (LeaveApplication.applicant_id == current_user.id) | 
            (LeaveApplication.applicant.has(role=RoleEnum.student))
        )
    leaves = query.order_by(LeaveApplication.applied_at.desc()).all()
    for leave in leaves:
        if leave.applicant:
            if leave.applicant.student_profile:
                leave.applicant_name = leave.applicant.student_profile[0].name
            elif leave.applicant.faculty_profile:
                leave.applicant_name = leave.applicant.faculty_profile[0].name
            else:
                leave.applicant_name = leave.applicant.username
    return leaves

@router.patch("/leave/{id}", response_model=LeaveResponse)
def update_leave_status(
    id: str,
    status_update: LeaveStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [RoleEnum.faculty, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Not authorized to approve leave")
        
    leave = db.query(LeaveApplication).filter(LeaveApplication.id == id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave application not found")
        
    leave.status = status_update.status
    leave.reviewed_by = current_user.id
    
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave

# ─── Profiles ─────────────────────────────────────────────────────────────────

# Student Profile
@router.get("/profile/student", response_model=StudentResponse)
def get_student_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.student:
        raise HTTPException(status_code=403, detail="Not a student")
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.email = current_user.email
    return profile

@router.patch("/profile/student", response_model=StudentResponse)
def update_student_profile(
    profile_update: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.student:
        raise HTTPException(status_code=403, detail="Not a student")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = profile_update.model_dump(exclude_unset=True)
    if "email" in update_data:
        existing_user = db.query(User).filter(User.email == update_data["email"]).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = update_data.pop("email")
        db.add(current_user)

    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.add(profile)
    db.commit()
    db.refresh(profile)
    profile.email = current_user.email
    return profile

@router.post("/profile/student/avatar", response_model=StudentResponse)
def update_student_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.student:
        raise HTTPException(status_code=403, detail="Not a student")
        
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile.avatar:
        delete_file(profile.avatar)
        
    file_url = save_upload_file(file, subfolder="avatars")
    profile.avatar = file_url
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    profile.email = current_user.email
    return profile

# Faculty Profile
@router.get("/profile/faculty", response_model=FacultyResponse)
def get_faculty_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.faculty:
        raise HTTPException(status_code=403, detail="Not a faculty")
    profile = db.query(FacultyProfile).filter(FacultyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.email = current_user.email
    return profile

@router.patch("/profile/faculty", response_model=FacultyResponse)
def update_faculty_profile(
    profile_update: FacultyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.faculty:
        raise HTTPException(status_code=403, detail="Not a faculty")

    profile = db.query(FacultyProfile).filter(FacultyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = profile_update.model_dump(exclude_unset=True)
    if "email" in update_data:
        existing_user = db.query(User).filter(User.email == update_data["email"]).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = update_data.pop("email")
        db.add(current_user)

    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.add(profile)
    db.commit()
    db.refresh(profile)
    profile.email = current_user.email
    return profile

@router.post("/profile/faculty/avatar", response_model=FacultyResponse)
def update_faculty_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.faculty:
        raise HTTPException(status_code=403, detail="Not a faculty")
        
    profile = db.query(FacultyProfile).filter(FacultyProfile.user_id == current_user.id).first()
    if profile.avatar:
        delete_file(profile.avatar)
        
    file_url = save_upload_file(file, subfolder="avatars")
    profile.avatar = file_url
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    profile.email = current_user.email
    return profile

# Admin Profile
@router.get("/profile/admin", response_model=AdminProfileResponse)
def get_admin_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    profile = db.query(AdminProfile).filter(AdminProfile.user_id == current_user.id).first()
    if not profile:
        # Create initial profile if missing
        profile = AdminProfile(user_id=current_user.id, name="Administrator", phone="1234567890")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    profile.email = current_user.email
    return profile

@router.patch("/profile/admin", response_model=AdminProfileResponse)
def update_admin_profile(
    profile_update: AdminProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not an admin")

    profile = db.query(AdminProfile).filter(AdminProfile.user_id == current_user.id).first()
    if not profile:
        profile = AdminProfile(user_id=current_user.id, name="Administrator")
        db.add(profile)

    update_data = profile_update.model_dump(exclude_unset=True)
    if "email" in update_data:
        current_user.email = update_data.pop("email")
        db.add(current_user)

    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.add(profile)
    db.commit()
    db.refresh(profile)
    profile.email = current_user.email
    return profile

@router.post("/profile/admin/avatar", response_model=AdminProfileResponse)
def update_admin_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not an admin")
        
    profile = db.query(AdminProfile).filter(AdminProfile.user_id == current_user.id).first()
    if not profile:
        profile = AdminProfile(user_id=current_user.id, name="Administrator")
        db.add(profile)
    elif profile.avatar:
        delete_file(profile.avatar)
        
    file_url = save_upload_file(file, subfolder="avatars")
    profile.avatar = file_url
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    profile.email = current_user.email
    return profile

