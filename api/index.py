import sys
import traceback
from pathlib import Path
from fastapi import FastAPI

# Vercel needs 'app' to be defined for the build to pass.
# If our main import fails, we'll use this dummy app to show the error.
app = FastAPI()

# Add the 'backend' directory to the Python path
backend_path = Path(__file__).parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

try:
    from main import app as fastapi_app
    # Overwrite the dummy app with the real one
    app = fastapi_app
except ImportError as e:
    error_msg = f"CRITICAL: Failed to import FastAPI app from backend/main.py.\nError: {e}\nTraceback: {traceback.format_exc()}"
    print(error_msg)
    
    @app.get("/api/v1/debug")
    async def debug_error():
        return {
            "status": "error",
            "message": error_msg,
            "sys_path": sys.path,
            "cwd": str(Path.cwd()),
            "files_in_backend": [str(f.name) for f in backend_path.iterdir()] if backend_path.exists() else "backend_folder_missing"
        }
except Exception as e:
    error_msg = f"CRITICAL: Unexpected error during app initialization.\nError: {type(e).__name__}: {e}\nTraceback: {traceback.format_exc()}"
    print(error_msg)
    
    @app.get("/api/v1/debug")
    async def debug_unexpected():
        return {"status": "critical_error", "message": error_msg}
