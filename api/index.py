import sys
from pathlib import Path

# Add the 'backend' directory to the Python path
backend_path = Path(__file__).parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

try:
    from main import app as fastapi_app
    # Vercel needs the 'app' variable at the top level
    app = fastapi_app
except ImportError as e:
    print(f"CRITICAL: Failed to import FastAPI app from backend/main.py: {e}")
    raise e
