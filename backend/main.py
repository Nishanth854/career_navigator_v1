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

@app.post("/api/v1/chat-support")
async def chat_support(query: dict):
    user_msg = query.get("text", "")
    context = query.get("context", {})
    
    name = context.get("name", "Student")
    dept = context.get("department", "Unknown Dept")
    score = context.get("score", "Unknown")
    
    if model:
        try:
            prompt = f"You are StudentMate AI, an advanced career counselor. The user is a student named {name} studying {dept} with a market valuation score of {score}. Respond to their query concisely and professionally in less than 3 sentences. User Query: {user_msg}"
            response = model.generate_content(prompt)
            return {"response": response.text}
        except Exception as e:
            print(f"Gemini Error: {e}")
            return {"response": f"I'm sorry {name}, but my AI engine encountered an error connecting to Gemini. Try again later."}
    else:
        # Fallback Mock Response
        if "score" in user_msg.lower():
            return {"response": f"Your current market valuation score is {score}, {name}. Try adding certifications on the Evaluate page to boost it!"}
        elif "roadmap" in user_msg.lower():
            return {"response": f"Your career roadmap is available on the Home page. Keep completing those tasks to improve your profile!"}
        else:
            return {"response": f"That's a great question, {name}! Since my AI brain (Gemini) isn't fully configured with an API key yet, I can only give this placeholder answer: Consider exploring local {dept} opportunities."}
