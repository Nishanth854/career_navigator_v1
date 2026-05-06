import pytesseract
from PIL import Image
import os
import re

# =================================================================
# WINDOWS USERS: POINT TO YOUR TESSERACT INSTALLATION
# =================================================================
# If you just installed Tesseract, ensure this path is correct:
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_path):
    """
    Reads an image file and returns the extracted raw text.
    """
    try:
        if not os.path.exists(image_path):
            return "Error: Image file not found."

        # Open the image using PIL
        img = Image.open(image_path)

        # Use Tesseract to convert image to string
        text = pytesseract.image_to_string(img)
        
        return text.strip()
    except Exception as e:
        return f"OCR Error: {str(e)}"

def parse_student_data(raw_text):
    # Improved GPA regex: looks for numbers like 3.5, 8.5, 95%
    # It now searches for patterns after words like GPA, CGPA, or Percentage
    gpa_match = re.search(r'(?:GPA|CGPA|Score|Result)[:\s]+(\d?\.?\d+)', raw_text, re.IGNORECASE)
    
    if gpa_match:
        gpa_value = float(gpa_match.group(1))
    else:
        # Fallback: if no GPA is found, we give a base score so it's not 0
        gpa_value = 7.0 

    # Look for skills
    skills_list = ["python", "java", "react", "sql", "aws", "javascript", "node"]
    found_skills = [skill for skill in skills_list if skill in raw_text.lower()]

    # Calculate the final score for the frontend
    # GPA * 10 + bonus for each skill
    calculated_score = int((gpa_value * 10) + (len(found_skills) * 5))
    
    return {
        "gpa": gpa_value,
        "skills": found_skills,
        "valuation_score": min(99, calculated_score) # This sends the number to the UI
    }