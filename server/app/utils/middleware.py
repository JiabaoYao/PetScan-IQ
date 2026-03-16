import time
from fastapi import Request, FastAPI

app = FastAPI()

@app.middleware("http")
async def user_verify(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    print(f"Request to {request.url.path} took {duration:.4f} seconds")
    return response