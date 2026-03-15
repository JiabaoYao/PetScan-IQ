from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    images: list[str] | None = None  # Optional list of image URLs
    
class AnalyzeRequest(BaseModel):
    image_url: str

class ChatResponse(BaseModel):
    answer: str