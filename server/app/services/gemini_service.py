from app.models.chatbot import ChatRequest, AnalyzeRequest
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
    
    
    async def diagnose(self, request: ChatRequest):
        prompt = (
            f"You are a veterinary diagnostic assistant. Based on the following symptoms, provide a possible diagnosis and recommended next steps for the pet owner.\n\n"
            f"Symptoms: {request.message}\n {response.images if request.images else ''}"
        )
        
        response = self.client.models.generate_content(model=self.model_id, contents=prompt)
        
        return response.text
    
    
    async def analyze_pet_mood(self, request: AnalyzeRequest):
        prompt = (
            f"You are a pet mood analyzer. Based on the image of the pet provided, analyze the pet's mood and provide insights into its emotional state.\n\n"
            f"Image URL: {request.image_url}"
        )
        
        response = self.client.models.generate_content(model=self.model_id, contents=prompt)
        
        return response.text
    
    
    async def identifyBreed(self, request: AnalyzeRequest):
        prompt = (
            f"You are a pet breed identifier. Based on the following image of the pet, identify the most likely breed(s) and provide a brief description of each.\n\n"
            f"Image URL: {request.image_url}"
        )
        
        response = self.client.models.generate_content(model=self.model_id, contents=prompt)
        
        return response.text