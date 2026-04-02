import sys
import os
from pathlib import Path

# Add the 'backend' directory to the Python path so imports inside main.py work
backend_path = Path(__file__).parent.parent / "backend"
sys.path.append(str(backend_path))

try:
    from main import app
except ImportError as e:
    print(f"Error importing app: {e}")
    raise e
