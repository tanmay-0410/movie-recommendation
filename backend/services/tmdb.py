import httpx
from core.config import settings
from typing import Dict, Any

class TMDBService:
    def __init__(self):
        self.base_url = settings.TMDB_BASE_URL
        self.api_key = settings.TMDB_API_KEY
    
    async def _get(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        if params is None:
            params = {}
        params["api_key"] = self.api_key
        
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
            
    async def get_trending(self, media_type: str = "movie", time_window: str = "day") -> Dict[str, Any]:
        return await self._get(f"/trending/{media_type}/{time_window}")
        
    async def get_top_rated(self) -> Dict[str, Any]:
        return await self._get("/movie/top_rated")
        
    async def search_movie(self, query: str) -> Dict[str, Any]:
        return await self._get("/search/movie", {"query": query})
        
    async def get_genres(self) -> Dict[str, Any]:
        return await self._get("/genre/movie/list")
        
    async def get_movie_details(self, movie_id: int) -> Dict[str, Any]:
        return await self._get(f"/movie/{movie_id}")
        
    async def get_similar_movies(self, movie_id: int) -> Dict[str, Any]:
        return await self._get(f"/movie/{movie_id}/similar")
        
    async def get_recommendations(self, movie_id: int) -> Dict[str, Any]:
        return await self._get(f"/movie/{movie_id}/recommendations")

    async def discover_by_genre(self, genre_id: int, page: int = 1) -> Dict[str, Any]:
        return await self._get("/discover/movie", {
            "with_genres": str(genre_id),
            "sort_by": "popularity.desc",
            "page": str(page)
        })

    async def get_now_playing(self) -> Dict[str, Any]:
        return await self._get("/movie/now_playing")

    async def get_upcoming(self) -> Dict[str, Any]:
        return await self._get("/movie/upcoming")

tmdb_service = TMDBService()
