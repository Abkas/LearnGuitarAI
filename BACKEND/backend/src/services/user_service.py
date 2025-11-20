from fastapi import HTTPException
from typing import Optional, Dict, Any
from bson import ObjectId
from ..core.database import get_users_collection
from ..middlewares.auth import hash_password, verify_password, create_access_token


def verify_token_and_get_user(email: str) -> Dict[str, Any]:
    users = get_users_collection()
    user = users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return user


def create_user(username: str, email: str, password: str) -> Dict[str, str]:
    try:
        users = get_users_collection()
        
        if users.find_one({'email': email}):
            raise HTTPException(status_code=400, detail='Email already exists')
        
        user_dict = {
            'username': username,
            'email': email,
            'password': hash_password(password)
        }
        result = users.insert_one(user_dict)
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail='Failed to create user')
        
        return {'msg': 'User created successfully'}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup Error: {str(e)}")  
        raise HTTPException(status_code=500, detail=str(e))


def authenticate_user(email: str, password: str) -> Dict[str, str]:
    users = get_users_collection()
    db_user = users.find_one({'email': email})

    if not db_user or not verify_password(password, db_user['password']):
        raise HTTPException(status_code=401, detail='Invalid Credentials')

    token = create_access_token({'sub': db_user['email']})
    return {'access_token': token, 'token_type': 'bearer'}


def update_user_profile(
    current_email: str,
    username: Optional[str] = None,
    email: Optional[str] = None,
    password: Optional[str] = None
) -> Dict[str, str]:
    users = get_users_collection()
    db_user = users.find_one({'email': current_email})
    if not db_user: 
        raise HTTPException(status_code=404, detail='User not found')

    update_data = {}
    if username:
        update_data['username'] = username
    if email:
        update_data['email'] = email
    if password:
        update_data['password'] = hash_password(password)

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update.")

    users.update_one({'email': current_email}, {'$set': update_data})
    return {'msg': 'User updated successfully'}


def get_user_by_email(email: str) -> Dict[str, Any]:
    users = get_users_collection()
    db_user = users.find_one({'email': email}, {'_id': 0, 'password': 0})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
