import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

try:
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(model.name)
except Exception as e:
    print(f"Error: {e}")
    print(f"API Key exists: {bool(os.getenv('GEMINI_API_KEY'))}")
