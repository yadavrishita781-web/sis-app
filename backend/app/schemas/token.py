from pydantic import BaseModel
from app.models.user import RoleEnum

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: str = None
    role: RoleEnum = None
