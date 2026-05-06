from fastapi import APIRouter, UploadFile, File, HTTPException
from student_valuation.utils.image_utils import get_processed_image
from student_valuation.utils.text_cleaner import clean_ocr_output
from student_valuation.profile_extractor import ProfileExtractor
import pytesseract
import os

# TESSERACT PATH CONFIGURATION
# On Vercel/Linux, we expect 'tesseract' to be in the PATH if installed.
# On Windows, we use the local path.
if os.name == 'nt': # Windows
    pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_CMD", r'C:\Program Files\Tesseract-OCR\tesseract.exe')
else: # Linux/Cloud
    pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_CMD", 'tesseract')

# Initialize the router and the logic classes
router = APIRouter()
extractor = ProfileExtractor()

# Allowed file types for security
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def is_allowed_file(filename: str):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

from database.lancedb_setup import search_opportunities
from student_valuation.ocr_engine import extract_text_from_image, parse_student_data

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    # 1. Save file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())

    try:
        # 2. Run OCR
        raw_text = extract_text_from_image(temp_path)
        student_data = parse_student_data(raw_text)
        
        # 3. Get Skills from OCR
        skills = student_data.get("skills", [])
        query_text = " ".join(skills) if skills else "general"

        # 4. Search opportunities using our new logic
        matches = search_opportunities(query_text)

        # 5. Clean up and return
        os.remove(temp_path)
        return {
    "valuation_score": student_data.get("valuation_score", 0), # Get the pre-calculated score
    "extracted_skills": student_data.get("skills", []),
    "matches": matches
}
    except Exception as e:
        if os.path.exists(temp_path): os.remove(temp_path)
        return {"error": str(e), "matches": []}
    
@router.post("/upload-certificate")
async def upload_certificate(file: UploadFile = File(...)):
    """
    A specialized endpoint for certificates to verify 
    specific achievements for the Valuation score.
    """
    # This follows similar logic but could be used to specifically 
    # update 'Hackathon' or 'Scholarship' status.
    return {"message": "Certificate endpoint ready for future logic."}