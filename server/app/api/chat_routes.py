from fastapi import APIRouter
from app.models.chatbot import ChatRequest, ChatResponse, AnalyzeRequest
from app.services.gemini_service import GeminiService


router = APIRouter()
agent = GeminiService()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # You must provide 'context' because generate_response requires it
    # We pass an empty string or a default persona instruction
    response = await agent.generate_response(
        request=request, 
        context="You are a helpful pet care assistant."
    )
    return ChatResponse(answer=response)

@router.post("/diagnose", response_model=ChatResponse)
async def diagnose_endpoint(request: ChatRequest):
    response = await agent.diagnose(request)
    return ChatResponse(answer=response)

@router.post("/analyze-mood", response_model=ChatResponse)
async def analyze_mood_endpoint(request: AnalyzeRequest):
    response = await agent.analyze_pet_mood(request)
    return ChatResponse(answer=response)

@router.post("/identify-breed", response_model=ChatResponse)
async def identify_breed_endpoint(request: AnalyzeRequest):
    response = await agent.identifyBreed(request)
    return ChatResponse(answer=response) 