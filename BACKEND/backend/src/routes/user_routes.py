from fastapi import APIRouter, Depends
from ..models.user_model import User
from ..middlewares.auth import get_current_user
from ..services import user_service
from ..schemas.user_schemas import UserLogin, UserUpdate

router = APIRouter()


@router.get("/verify-token")
async def verify_token(current_user: dict = Depends(get_current_user)):
    return user_service.verify_token_and_get_user(current_user)


@router.post('/signup')
async def signup_user(user: User):
    return user_service.create_user(
        user.username,
        user.email,
        user.password,
        plan=user.plan if hasattr(user, 'plan') else "Free",
        progress_level=user.progress_level if hasattr(user, 'progress_level') else "Beginner"
    )


@router.post('/login')
async def login_user(user: UserLogin):
    return user_service.authenticate_user(user.email, user.password)

@router.post('/update')
def update_user(update: UserUpdate, current_email: str = Depends(get_current_user)):
    return user_service.update_user_profile(
        current_email,
        username=update.username,
        email=update.email,
        password=update.password,
        plan=update.plan,
        progress_level=update.progress_level
    )


@router.get("/get-user")
def get_current_user_info(current_email: str = Depends(get_current_user)):
    return user_service.get_user_by_email(current_email)