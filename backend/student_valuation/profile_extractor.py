import re
import spacy

# Load the NLP model for entity recognition (Skills, Names, etc.)
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback if model isn't downloaded
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

class ProfileExtractor:
    def __init__(self):
        # Define skill sets to look for
        self.skill_db = [
            "python", "javascript", "react", "fastapi", "sql", "machine learning",
            "data analysis", "java", "c++", "ui/ux", "project management", "aws"
        ]

    def extract_gpa(self, text):
        """Finds GPA patterns like 3.5/4.0 or GPA: 8.2"""
        gpa_pattern = r'GPA[:\s]+(\d\.\d+)'
        match = re.search(gpa_pattern, text, re.IGNORECASE)
        return float(match.group(1)) if match else None

    def extract_skills(self, text):
        """Matches text against our skill database"""
        found_skills = []
        clean_text = text.lower()
        for skill in self.skill_db:
            if skill in clean_text:
                found_skills.append(skill.capitalize())
        return found_skills

    def extract_education(self, text):
        """Identifies Degree type"""
        degrees = ["B.E", "B.Tech", "M.Tech", "BCA", "MCA", "B.Sc", "MBA"]
        for degree in degrees:
            if degree.lower() in text.lower():
                return degree
        return "Unknown Degree"

    def get_full_profile(self, raw_text):
        """Compiles all extractions into a single profile dictionary"""
        doc = nlp(raw_text)
        
        return {
            "gpa": self.extract_gpa(raw_text),
            "skills": self.extract_skills(raw_text),
            "degree": self.extract_education(raw_text),
            "raw_text_length": len(raw_text)
        }

# For testing independently
if __name__ == "__main__":
    test_text = "Student Resume. Degree: B.Tech in CSE. GPA: 3.9. Skills include Python, SQL and AWS."
    extractor = ProfileExtractor()
    print(extractor.get_full_profile(test_text))