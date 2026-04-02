from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from fastapi import HTTPException
import logging

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    if db.client is None:
        try:
            uri = settings.MONGODB_URI
            db.client = AsyncIOMotorClient(
                uri,
                serverSelectionTimeoutMS=5000
            )
            # Test the connection
            await db.client.admin.command('ping')
            logging.info("Connected to MongoDB")
        except Exception as e:
            db.client = None
            logging.error(f"Error connecting to MongoDB: {e}")
            raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
    return db.client[settings.DATABASE_NAME]

