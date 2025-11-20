from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional

class User(BaseModel):
    id: Optional[str] =Field(default = None , alias= '_id')
    username: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    plan: str = Field(default="Free")
    progress_level: str = Field(default="Beginner")
