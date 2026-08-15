import random
import string
import uuid

def generate_random_password(length: int = 10) -> str:
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(random.choice(chars) for _ in range(length))

def generate_student_username(name: str, roll_no: str) -> str:
    base = name.split()[0].lower()
    return f"{base}.{roll_no.lower()}"

def generate_faculty_username(name: str) -> str:
    base = name.replace(" ", ".").lower()
    return f"{base}.{str(uuid.uuid4())[:4]}"

def generate_uuid() -> str:
    return str(uuid.uuid4())
