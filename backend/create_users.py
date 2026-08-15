import sys
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.database.base import Base
from app.database.session import engine
from app.models.user import User, RoleEnum
from app.models.profiles import StudentProfile, FacultyProfile, AdminProfile
from app.models.academic import Department, Subject, Timetable
from app.models.operations import Attendance, Assignment, AssignmentSubmission, StudyMaterial, Result, Notice
from app.models.extras import Fee
from app.models.leave import LeaveApplication
from app.core.security import get_password_hash
from app.utils.auth_utils import generate_uuid

# Create all tables first
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_db():
    print("Seeding database...")

    # 1. Admin
    admin_user = db.query(User).filter(User.email == 'admin@sis.edu').first()
    if not admin_user:
        admin_user = User(
            id=generate_uuid(),
            email='admin@sis.edu',
            username='admin@sis.edu',
            hashed_password=get_password_hash('admin123'),
            role=RoleEnum.admin,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
    admin_profile = db.query(AdminProfile).filter(AdminProfile.user_id == admin_user.id).first()
    if not admin_profile:
        admin_profile = AdminProfile(
            user_id=admin_user.id,
            name="System Administrator",
            phone="9876543210"
        )
        db.add(admin_profile)
        db.commit()

    # 2. Faculty
    faculty_user = db.query(User).filter(User.email == 'suraj@sis.edu').first()
    if not faculty_user:
        faculty_user = User(
            id=generate_uuid(),
            email='suraj@sis.edu',
            username='suraj@sis.edu',
            hashed_password=get_password_hash('faculty123'),
            role=RoleEnum.faculty,
            is_active=True
        )
        db.add(faculty_user)
        db.commit()
        db.refresh(faculty_user)

    faculty_profile = db.query(FacultyProfile).filter(FacultyProfile.user_id == faculty_user.id).first()
    if not faculty_profile:
        faculty_profile = FacultyProfile(
            user_id=faculty_user.id,
            name="Prof. Suraj Kumar",
            phone="9876543211",
            department="Computer Science",
            designation="Senior Professor",
            experience="8 years"
        )
        db.add(faculty_profile)
        db.commit()

    # 3. Student
    student_user = db.query(User).filter(User.email == 'rishita@sis.edu').first()
    if not student_user:
        student_user = User(
            id=generate_uuid(),
            email='rishita@sis.edu',
            username='rishita@sis.edu',
            hashed_password=get_password_hash('student123'),
            role=RoleEnum.student,
            is_active=True
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == student_user.id).first()
    if not student_profile:
        student_profile = StudentProfile(
            user_id=student_user.id,
            name="Rishita Yadav",
            roll_no="CS2024001",
            phone="9876543212",
            department="Computer Science",
            semester=3,
            section="A",
            batch="2023-2027",
            dob="2003-05-15",
            gender="Female",
            address="123 Academic Enclave, City",
            parent_name="Rajesh Yadav",
            parent_phone="9876543213"
        )
        db.add(student_profile)
        db.commit()

    # 4. Department
    dept = db.query(Department).filter(Department.code == 'CS').first()
    if not dept:
        dept = Department(
            id=generate_uuid(),
            name="Computer Science",
            code="CS",
            hod_id=faculty_user.id
        )
        db.add(dept)
        db.commit()
        db.refresh(dept)

    # 5. Subject
    subject = db.query(Subject).filter(Subject.code == 'CS301').first()
    if not subject:
        subject = Subject(
            id=generate_uuid(),
            name="Data Structures & Algorithms",
            code="CS301",
            credits=4,
            department_id=dept.id,
            semester=3,
            faculty_id=faculty_user.id
        )
        db.add(subject)
        db.commit()
        db.refresh(subject)

    # 6. Notice
    if db.query(Notice).count() == 0:
        notice = Notice(
            id=generate_uuid(),
            title="Mid-Semester Examination Schedule Announced",
            content="The mid-semester examinations for Semester 3 will begin from next Monday. Please check the timetable.",
            type="exam",
            priority="high",
            published_by=admin_user.id
        )
        db.add(notice)

    # 7. Fee
    if db.query(Fee).count() == 0:
        fee = Fee(
            id=generate_uuid(),
            student_id=student_user.id,
            type="Tuition Fee - Semester 3",
            amount=45000.0,
            status="pending",
            due_date=date.today() + timedelta(days=15)
        )
        db.add(fee)

    db.commit()
    print("Database seeding completed successfully.")

if __name__ == '__main__':
    seed_db()
