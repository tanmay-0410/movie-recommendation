from fastapi import APIRouter, Query
from services.tmdb import tmdb_service
from typing import Any

router = APIRouter()

@router.get("/trending")
async def get_trending(media_type: str = "movie", time_window: str = "day") -> Any:
    return await tmdb_service.get_trending(media_type, time_window)

@router.get("/top-rated")
async def get_top_rated() -> Any:
    return await tmdb_service.get_top_rated()

@router.get("/search")
async def search_movie(query: str = Query(..., min_length=1)) -> Any:
    return await tmdb_service.search_movie(query)

@router.get("/genres")
async def get_genres() -> Any:
    return await tmdb_service.get_genres()

@router.get("/{movie_id}")
async def get_movie_details(movie_id: int) -> Any:
    return await tmdb_service.get_movie_details(movie_id)

@router.get("/{movie_id}/similar")
async def get_similar(movie_id: int) -> Any:
    return await tmdb_service.get_similar_movies(movie_id)

@router.get("/{movie_id}/recommendations")
async def get_recommendations(movie_id: int) -> Any:
    return await tmdb_service.get_recommendations(movie_id)

@router.get("/discover/{genre_id}")
async def discover_by_genre(genre_id: int) -> Any:
    return await tmdb_service.discover_by_genre(genre_id)

@router.get("/category/now-playing")
async def get_now_playing() -> Any:
    return await tmdb_service.get_now_playing()

@router.get("/category/upcoming")
async def get_upcoming() -> Any:
    return await tmdb_service.get_upcoming()

@router.get("/{movie_id}/providers")
async def get_watch_providers(movie_id: int) -> Any:
    return await tmdb_service.get_watch_providers(movie_id)
