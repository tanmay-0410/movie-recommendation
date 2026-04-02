import urllib.request
import time

test_url = "https://wsrv.nl/?url=image.tmdb.org/t/p/w342/2RVcJbWFmICRDsVxBI9F58Rah3q.jpg"
direct_url = "https://image.tmdb.org/t/p/w342/2RVcJbWFmICRDsVxBI9F58Rah3q.jpg"

start = time.time()
try:
    urllib.request.urlopen(direct_url)
    print(f"Direct TMDB time: {time.time() - start:.2f}s")
except Exception as e:
    print("Direct failed", e)

start = time.time()
try:
    urllib.request.urlopen(test_url)
    print(f"WSRV Proxy time: {time.time() - start:.2f}s")
except Exception as e:
    print("WSRV failed", e)
