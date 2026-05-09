import os
import json
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
import lancedb
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# Initialize the router
router = APIRouter()

# Connect to the existing database
try:
    db = lancedb.connect("lancedb_data")
    table = db.open_table("opportunities")
except Exception as e:
    print(f"Database connection error: {e}")

@router.post("/find-matches")
async def find_matches(student_data: dict):
    """
    Takes a dictionary containing 'skills' or 'raw_text' 
    and returns matching internships/scholarships.
    """
    try:
        # We use the 'Required_Skills' column for vector matching
        # query_text can be the list of skills or the whole cleaned resume text
        query_text = student_data.get("raw_text", "")
        
        if not query_text:
            raise HTTPException(status_code=400, detail="No search text provided")

        # Perform the Semantic Search
        # .search() automatically handles the vectorization of the query
        results = table.search(query_text).limit(5).to_list()

        formatted_results = []
        for res in results:
            formatted_results.append({
                "id": res.get("id") or res.get("ID") or "",
                "title": res.get("title") or res.get("Title") or "Unknown",
                "type": res.get("type") or res.get("Type") or "Opportunity",
                "company": res.get("company") or res.get("Provider") or "Unknown",
                "location": res.get("location") or "Remote",
                "description": res.get("description") or res.get("Required_Skills") or "",
                "url": res.get("url") or "#",
                "match_score": round(res.get("_distance", 0), 2)
            })

        return {"matches": formatted_results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_categories():
    """Returns a list of unique opportunity types (Internship, Scholarship, etc.)"""
    df = table.to_pandas()
    categories = df['Type'].unique().tolist()
    return {"categories": categories}

from database.lancedb_setup import search_opportunities # Ensure this import exists

@router.post("/manual-valuation")
async def manual_valuation(data: dict):
    # Extract data from frontend
    name = data.get("name", "Student")
    department = data.get("department", "General")
    college = data.get("college", "University")
    skills_raw = data.get("skills", "")
    gpa = float(data.get("gpa", 0))

    # New advanced fields
    arrears = int(data.get("arrears", 0))
    certifications_raw = data.get("certifications", "")
    community = data.get("community", "OC")
    family_income = data.get("familyIncome", "Below 2 Lakhs")
    year = int(data.get("year", 1))
    semester = int(data.get("semester", 1))

    # Process skills and certifications
    skills = [s.strip().lower() for s in skills_raw.split(",") if s.strip()]
    certifications = [c.strip() for c in certifications_raw.split(",") if c.strip()]
    
    # Calculate score
    score = int((gpa * 10) + (len(skills) * 5))
    
    # Add bonus for certifications
    score += (len(certifications) * 5)
    
    # Penalty for arrears
    score -= (arrears * 5)
    
    if score < 0:
        score = 0
    if score > 100:
        score = 100
    
    # Search logic
    from database.lancedb_setup import search_opportunities
    query_text = f"{department} {' '.join(skills)} {' '.join(certifications)}"
    matches = search_opportunities(query_text)
    
    ai_recommendations = {"internships": [], "scholarships": [], "events": []}
    ai_strategy = "Connect your Gemini API key in the backend .env to unlock your AI Career Strategy!"
    
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    if GEMINI_API_KEY:
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-flash-latest')
            prompt = f"""
            You are StudentMate AI. Analyze this student:
            Name: {name}, Dept: {department}, Skills: {', '.join(skills)}, Certifications: {', '.join(certifications)}, GPA: {gpa}, Arrears: {arrears}.
            Community: {community}, Annual Family Income: {family_income}.
            Return ONLY a valid JSON object (no markdown, no backticks, strictly parseable JSON) with this structure:
            {{
                "strategy": "A powerful 2-sentence personalized career strategy emphasizing their strengths.",
                "internships": [{{"title": "Direct Role at Company", "url": "https://company.com/careers/direct-apply-link", "description": "Short explanation"}}],
                "scholarships": [{{"title": "Specific Scholarship Name", "url": "https://provider.org/scholarship/apply-form", "description": "Short explanation"}}],
                "events": [{{"title": "Specific Hackathon", "url": "https://platform.com/event/register", "description": "Short explanation"}}]
            }}
            Provide exactly 2 highly relevant real-world online internships, 2 scholarships, and 2 hackathons/events. CRITICAL: Use the MOST DIRECT application or registration URL available, not just the homepage.
            """
            response = model.generate_content(prompt)
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:-3].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:-3].strip()
            
            parsed = json.loads(raw_text)
            ai_strategy = parsed.get("strategy", ai_strategy)
            ai_recommendations = {
                "internships": parsed.get("internships", []),
                "scholarships": parsed.get("scholarships", []),
                "events": parsed.get("events", [])
            }
        except Exception as e:
            print(f"Gemini evaluation error: {e}")
            ai_strategy = "Your AI Strategy could not be generated due to a timeout. Please try again."

    return {
    "student_info": {
        "name": name,
        "department": department,
        "college": college
    },
    "valuation_score": score,
    "extracted_skills": skills,
    "matches": matches,
    "ai_strategy": ai_strategy,
    "ai_recommendations": ai_recommendations
}

@router.post("/analyze-scheme")
async def analyze_scheme(data: dict):
    title = data.get("title", "Unknown Scheme")
    url = data.get("url", "#")
    type_str = data.get("type", "opportunity")
    
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    if not GEMINI_API_KEY:
        return {"status": "error", "message": "Gemini API key not configured."}
        
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-flash-latest')
        prompt = f"""
        Act as an expert career advisor. The student clicked on an online {type_str} titled '{title}' with this URL: {url}.
        Provide a highly realistic breakdown of what is usually required to apply for this.
        Return ONLY a valid JSON object (no backticks, no markdown) with exactly this structure:
        {{
            "documents": ["list of 3-5 required documents"],
            "procedure": ["step 1", "step 2", "step 3"]
        }}
        """
        response = model.generate_content(prompt)
        
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        parsed = json.loads(raw_text)
        return {
            "status": "success",
            "title": title,
            "url": url,
            "documents": parsed.get("documents", ["Updated Resume", "College ID Card", "Academic Transcripts"]),
            "procedure": parsed.get("procedure", ["Visit the official application portal.", "Fill out your personal and academic details.", "Upload the required documents and submit."])
        }
    except Exception as e:
        print(f"Gemini scheme analysis error: {e}")
        # Return graceful fallback
        return {
            "status": "success",
            "title": title,
            "url": url,
            "documents": ["Updated Resume", "College ID Card", "Academic Transcripts"],
            "procedure": ["Visit the official application portal.", "Fill out your personal and academic details.", "Upload the required documents and submit."]
        }

@router.post("/startup-valuation")
async def startup_valuation(data: dict):
    startup_title = data.get("startupTitle", "Unknown Project").strip()
    startup_idea = data.get("startupIdea", "").strip()

    if not startup_idea:
        raise HTTPException(status_code=400, detail="Startup idea is required.")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    ai_strategy = "Connect your Gemini API key to unlock your AI Startup Strategy!"
    ai_recommendations = {"subsidies": [], "incubators": []}

    if GEMINI_API_KEY:
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-flash-latest')
            prompt = f"""
            You are an expert AI Startup Advisor and Venture Capital Analyst. Analyze this new startup concept:
            Title: {startup_title}
            Description/Idea: {startup_idea}
            
            Return ONLY a valid JSON object (no markdown, no backticks, strictly parseable JSON) with this structure:
            {{
                "strategy": "A powerful 2-3 sentence market validation and strategy for launching this startup.",
                "target_audience": "Who they should sell this to in 1 short sentence.",
                "subsidies": [{{"title": "Direct Grant Name", "url": "https://government.gov.in/grants/apply", "description": "Short explanation"}}],
                "incubators": [{{"title": "Specific Incubator", "url": "https://incubator.com/program/apply", "description": "Short explanation"}}]
            }}
            Provide exactly 3 highly relevant real-world government grants/subsidies and 2 relevant incubator programs. CRITICAL: Use the MOST DIRECT application or registration URL available, not just the homepage.
            """
            response = model.generate_content(prompt)
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:-3].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:-3].strip()
            
            parsed = json.loads(raw_text)
            ai_strategy = parsed.get("strategy", ai_strategy)
            target_audience = parsed.get("target_audience", "General Public")
            ai_recommendations = {
                "subsidies": parsed.get("subsidies", []),
                "incubators": parsed.get("incubators", [])
            }
            return {
                "ai_strategy": ai_strategy,
                "target_audience": target_audience,
                "ai_recommendations": ai_recommendations
            }
        except Exception as e:
            print(f"Gemini startup evaluation error: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate AI Startup analysis.")
    else:
        raise HTTPException(status_code=500, detail="Gemini API Key missing.")