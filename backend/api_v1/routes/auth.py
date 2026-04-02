from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from models.user import UserCreate, UserResponse, Token, UserInDB
from core.security import get_password_hash, verify_password, create_access_token
from db.database import get_database
from typing import Any

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate, db: Any = Depends(get_database)):
    user_exists = await db["users"].find_one({"email": user_in.email})
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed_password = get_password_hash(user_in.password)
    user_dict = user_in.model_dump()
    del user_dict["password"]
    user_dict["hashed_password"] = hashed_password
    user_dict["favorites"] = []
    
    result = await db["users"].insert_one(user_dict)
    
    user_dict["id"] = str(result.inserted_id)
    return UserResponse(**user_dict)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Any = Depends(get_database)):
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(subject=user["email"])
    return {"access_token": access_token, "token_type": "bearer"}
