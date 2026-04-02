import asyncio
import sys
import logging

logging.basicConfig(level=logging.INFO)

from db.database import get_database

async def main():
    try:
        db = await get_database()
        print(f"✅ DB Debug Success: Connected to MongoDB database '{db.name}'")
    except Exception as e:
        print(f"❌ DB Debug Failed: Could not connect to MongoDB. Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Ensure nested loops or other issues don't block
    asyncio.run(main())
