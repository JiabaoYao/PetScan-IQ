from fastapi import FastAPI
from app.api.chat_routes import router as chat_router
import uvicorn

from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
def index():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)