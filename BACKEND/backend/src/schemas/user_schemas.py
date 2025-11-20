from pydantic import BaseModel, EmailStr, Field
from typing import Optional 
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str = Field(min_length=6)
    plan: Optional[str] = Field(default="Free")
    progress_level: Optional[str] = Field(default="Beginner")

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    plan: Optional[str] = None
    progress_level: Optional[str] = None

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    plan: str
    progress_level: str
    class Config:
        from_attributes = True
