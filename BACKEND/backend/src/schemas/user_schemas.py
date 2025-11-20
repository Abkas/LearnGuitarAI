from pydantic import BaseModel, EmailStr, Field
from typing import Optional 
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    username : str 
    password: str = Field(min_length = 6)

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    
    class Config:
        from_attributes = True
