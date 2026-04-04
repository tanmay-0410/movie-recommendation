from fastapi import APIRouter, Depends, HTTPException, status
from models.user import UserResponse, UserInDB
from api_v1.deps import get_current_user
from db.database import get_database
from typing import Any

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: UserInDB = Depends(get_current_user)):
    user_dict = current_user.model_dump()
    user_dict["id"] = str(current_user.id) if current_user.id else "0"
    return UserResponse(**user_dict)

@router.post("/favorites/{movie_id}")
async def add_favorite(movie_id: int, current_user: UserInDB = Depends(get_current_user), db: Any = Depends(get_database)):
    if movie_id in current_user.favorites:
        return {"message": "Movie already in favorites"}
        
    await db["users"].update_one(
        {"email": current_user.email},
        {"$push": {"favorites": movie_id}}
    )
    return {"message": "Added to favorites"}

@router.delete("/favorites/{movie_id}")
async def remove_favorite(movie_id: int, current_user: UserInDB = Depends(get_current_user), db: Any = Depends(get_database)):
    if movie_id not in current_user.favorites:
        return {"message": "Movie not in favorites"}
        
    await db["users"].update_one(
        {"email": current_user.email},
        {"$pull": {"favorites": movie_id}}
    )
    return {"message": "Removed from favorites"}

@router.get("/favorites")
async def get_favorites(current_user: UserInDB = Depends(get_current_user)):
    return {"favorites": current_user.favorites}

@router.post("/watchlist/{movie_id}")
async def add_to_watchlist(movie_id: int, current_user: UserInDB = Depends(get_current_user), db: Any = Depends(get_database)):
    if any(item.movie_id == movie_id for item in current_user.watchlist):
        return {"message": "Movie already in watchlist"}
    
    watchlist_item = {"movie_id": movie_id, "added_at": "2026-04-04T13:58:37+05:30", "notify_on_new_provider": False}
    await db["users"].update_one(
        {"email": current_user.email},
        {"$push": {"watchlist": watchlist_item}}
    )
    return {"message": "Added to watchlist"}

@router.delete("/watchlist/{movie_id}")
async def remove_from_watchlist(movie_id: int, current_user: UserInDB = Depends(get_current_user), db: Any = Depends(get_database)):
    await db["users"].update_one(
        {"email": current_user.email},
        {"$pull": {"watchlist": {"movie_id": movie_id}}}
    )
    return {"message": "Removed from watchlist"}

@router.patch("/watchlist/{movie_id}/alert")
async def toggle_watchlist_alert(movie_id: int, notify: bool, current_user: UserInDB = Depends(get_current_user), db: Any = Depends(get_database)):
    await db["users"].update_one(
        {"email": current_user.email, "watchlist.movie_id": movie_id},
        {"$set": {"watchlist.$.notify_on_new_provider": notify}}
    )
    return {"message": f"Alert set to {notify}"}
