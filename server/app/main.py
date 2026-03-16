import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from app.api.chat_routes import router as chat_router
from app.api.blog_routes import router as blog_router
import uvicorn
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.blog import Blog, Comment, Reply
from app.models.user import User, UserCreate, UserLogin
from app.api.user_routes import router as user_router

from fastapi.middleware.cors import CORSMiddleware

# Load .env from server directory (parent of app/)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = FastAPI(title="PawGuide AI Backend")

# frontend (HTML file) and backend (FastAPI) are on different "origins" (even if both are localhost), the browser will block the request for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows your React dev server to talk to FastAPI
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(blog_router, prefix="/api")
app.include_router(user_router, prefix="/api")

@app.on_event("startup")
async def start_db_client():
    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    database_name = os.getenv("MONGODB_DATABASE", "pet")
    client = AsyncIOMotorClient(mongodb_uri)
    database = client.get_database(database_name)
    for name in ("blogs", "users"):
        try:
            await database.create_collection(name)
        except Exception as e:
            if "already exists" not in str(e).lower():
                print(f"Error creating collection {name}: {e}")
    await init_beanie(database=database, document_models=[Blog, User])
    

@app.get("/")
def login():
    return {"status": "login"}


@app.get("/me")
def index():
    return {"status": "me"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)