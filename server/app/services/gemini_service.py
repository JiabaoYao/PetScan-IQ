from app.models.chat_models import ChatRequest
# import google.generativeai as genai
import os
from google import genai
from dotenv import load_dotenv

# load variables from .env file
load_dotenv()

class GeminiService:
    def __init__(self):
        self.model_id = "gemini-2.5-flash"
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
    async def generate_response(self, request: ChatRequest, context: str):
        # Context work as a guide
        prompt = (
                    f"You are a helpful pet care assistant. "
                    f"Use the following context to answer the user's question.\n\n"
                    f"Context: {context}\n\n"
                    f"User Question: {request.message}"
                )
        response = self.client.models.generate_content(model=self.model_id, contents=prompt)
        
        return response.text
        