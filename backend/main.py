import uvicorn
from career_engine_server import app
import sys
import os
import google.generativeai as genai
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv() # Load from .env

# Configure Gemini if key exists
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-flash-latest')
else:
    model = None

if __name__ == "__main__":
    print("🚀 StudentMate is starting...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
