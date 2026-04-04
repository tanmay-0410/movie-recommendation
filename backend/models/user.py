from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class WatchlistItem(BaseModel):
    movie_id: int
    added_at: datetime = Field(default_factory=datetime.utcnow)
    notify_on_new_provider: bool = False

class UserInDB(UserBase):
    id: Optional[str] = None
    hashed_password: str
    favorites: List[int] = [] # TMDB movie IDs
    watchlist: List[WatchlistItem] = [] # OTT Aggregator Watchlist
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(UserBase):
    id: str
    favorites: List[int] = []
    watchlist: List[WatchlistItem] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
