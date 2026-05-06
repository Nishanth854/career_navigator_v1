import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

try:
    print(f"Key loaded: {api_key[:5]}...{api_key[-5:]}" if api_key else "NO KEY")
    client = genai.Client(api_key=api_key)
    for model in client.models.list():
        print(model.name)
    print("SUCCESS!")
except Exception as e:
    print("ERROR:")
    import traceback
    traceback.print_exc()
