import asyncio
import sys
import logging

logging.basicConfig(level=logging.INFO)

from db.database import get_database
from core.config import settings

async def clear_database():
    try:
        # Get the database connection
        db = await get_database()
        db_name = settings.DATABASE_NAME
        
        # Drop the database
        await db.client.drop_database(db_name)
        print(f"\n✅ Successfully cleared/dropped the MongoDB database: '{db_name}'\n")
    except Exception as e:
        print(f"\n❌ Error clearing database: {e}\n")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(clear_database())
