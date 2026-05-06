import re

def calculate_student_score(extracted_text):
    score = 50  # Base score
    
    # Look for high-value keywords
    keywords = {
        "Python": 10,
        "Internship": 15,
        "Hackathon": 20,
        "GPA 3.8": 15,
        "Scholarship": 10
    }
    
    found_skills = []
    for word, points in keywords.items():
        if re.search(word, extracted_text, re.IGNORECASE):
            score += points
            found_skills.append(word)
            
    # Cap the score at 100
    final_score = min(score, 100)
    
    return {
        "score": final_score,
        "skills_identified": found_skills,
        "level": "Elite" if final_score > 85 else "Advanced" if final_score > 70 else "Intermediate"
    }