import urllib.request
import time

url = "https://api.tmdb.org/3/movie/popular?api_key=d36925c424229aed283da32c84d70f14"

print("Testing direct TMDB API connection on alternate domain...")
start = time.time()
try:
    with urllib.request.urlopen(url, timeout=5) as response:
        print(f"Success! Time: {time.time() - start:.2f}s, Status: {response.status}")
except Exception as e:
    print(f"Failed! Time: {time.time() - start:.2f}s, Error: {e}")
