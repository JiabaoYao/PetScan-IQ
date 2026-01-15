from fastapi import APIRouter
from app.models.chat_models import ChatRequest, ChatResponse
from app.services.gemini_service import GeminiService


router = APIRouter()
chatbot = GeminiService()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # You must provide 'context' because generate_response requires it
    # We pass an empty string or a default persona instruction
    response = await chatbot.generate_response(
        request=request, 
        context="You are a helpful pet care assistant."
    )
    return ChatResponse(answer=response)