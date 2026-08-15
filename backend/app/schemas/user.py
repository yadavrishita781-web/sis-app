from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import RoleEnum

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str
    role: RoleEnum

class UserResponse(UserBase):
    id: str
    role: RoleEnum
    is_active: bool

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
