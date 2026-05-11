from fastapi import APIRouter, HTTPException
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

router = APIRouter()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-flash-latest')
    except Exception as e:
        print(f"Failed to configure Gemini in quiz_routes: {e}")
        model = None
else:
    model = None

@router.get("/quiz/questions")
async def get_quiz_questions(dept: str = "General Technology"):
    if not model:
        # Fallback questions if Gemini is not available
        return [
            {
                "question": "What does CSS stand for?",
                "options": ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
                "correct": 1
            },
            {
                "question": "Which language is used for web scripting?",
                "options": ["Python", "Java", "JavaScript", "C++"],
                "correct": 2
            }
        ]

    try:
        prompt = f"""
        Generate 5 high-quality technical multiple-choice questions for a student in the department of {dept}.
        Return ONLY a JSON array of objects with the following structure:
        [
            {{
                "question": "The question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 0 (index of the correct option)
            }}
        ]
        Ensure the questions are challenging but fair for a university student.
        """
        response = model.generate_content(prompt)
        # Clean the response to ensure it's valid JSON
        json_str = response.text.strip()
        if json_str.startswith("```json"):
            json_str = json_str[7:-3].strip()
        elif json_str.startswith("```"):
            json_str = json_str[3:-3].strip()
            
        questions = json.loads(json_str)
        return questions
    except Exception as e:
        print(f"Gemini Quiz Generation Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate questions")

@router.post("/quiz/calculate-tier")
async def calculate_tier(data: dict):
    score = data.get("total_score", 0)
    
    tier = "Bronze"
    if score > 6000:
        tier = "Diamond"
    elif score > 3000:
        tier = "Platinum"
    elif score > 1500:
        tier = "Gold"
    elif score > 500:
        tier = "Silver"
        
    return {"tier": tier}
