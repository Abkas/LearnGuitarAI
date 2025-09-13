from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from src.models.user_model import User
from src.middlewares.auth import hash_password, verify_password, create_access_token



router = APIRouter()

class UserLogin(BaseModel):
    email : str
    password : str


@router.post('/signup')
def signup_user(user: User):
    users = get_users_collection()
    if user.find_one({'email': user.email}):
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