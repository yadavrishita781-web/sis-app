import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database.session import SessionLocal
from app.models.user import User, RoleEnum
from app.models.profiles import AdminProfile
from app.core.security import get_password_hash
from app.utils.auth_utils import generate_uuid

def seed_admin():
    db = SessionLocal()
    
    admin_email = "admin@sis.edu"
    admin_username = "admin"
    admin_password = "adminpassword"
    
    existing_admin = db.query(User).filter(User.username == admin_username).first()
    if existing_admin:
        print("Admin already exists.")
        return

    user_id = generate_uuid()
    new_admin = User(
        id=user_id,
        email=admin_email,
        username=admin_username,
        hashed_password=get_password_hash(admin_password),
        role=RoleEnum.admin
    )
    db.add(new_admin)
    
    admin_profile = AdminProfile(
        user_id=user_id,
        name="System Administrator",
        phone="1234567890"
    )
    db.add(admin_profile)
    
    db.commit()
    print(f"Admin created successfully! Username: {admin_username}, Password: {admin_password}")
    db.close()

if __name__ == "__main__":
    seed_admin()
