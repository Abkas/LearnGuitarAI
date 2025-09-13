from fastapi import HTTPException, APIRouter, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from src.models.user_model import User
from src.middlewares.auth import hash_password, get_current_user, verify_password, create_access_token
from src.core.database import get_users_collection

router = APIRouter()

class UserLogin(BaseModel):
    email : str
    password : str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

@router.post('/signup')
def signup_user(user: User):
    users = get_users_collection()
    if users.find_one({'email': user.email}):
        raise HTTPException(status_code = 400, detail = 'Email already exists')
    
    user_dict = user.dict()
    user_dict['password'] = hash_password(user.password)
    users.insert_one(user_dict)
    return {'msg':'User created sucessfully'}


@router.post('/login')
def login_user(user: UserLogin):
    users = get_users_collection()
    db_user = users.find_one({'email': user.email})

    if not db_user or not verify_password(user.password, db_user['password']):
        raise HTTPException(status_code = 401 , detail = 'Invalid Credentials')

    token = create_access_token({'sub' : db_user['email']})
    return {'access_token' : token, 'token_type': 'bearer'}

@router.post('/update')
def update_user(update: UserUpdate, current_email: str = Depends(get_current_user)):
    users = get_users_collection()
    db_user = users.find_one({'email': current_email})
    if not db_user: 
        raise HTTPException(status_code = 404, detail = 'User not found')

    update_data = {}
    if update.username:
        update_data['username'] = update.username
    if update.email:
        update_data['email'] = update.email
    if update.password:
        update_data['password'] = hash_password(update.password)

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update.")

    users.update_one({'email': current_email}, {'$set': update_data})
    return {'msg': 'User updated successfully'}


@router.get("/get-user")
def get_current_user_info(current_email: str = Depends(get_current_user)):
    users = get_users_collection()
    db_user = users.find_one({'email': current_email}, {'_id': 0, 'password': 0})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user