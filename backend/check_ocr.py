import pytesseract
import os

path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

print(f"Checking path: {path}")
if os.path.exists(path):
    print("✅ SUCCESS: Tesseract.exe found!")
    pytesseract.pytesseract.tesseract_cmd = path
    try:
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract Version: {version}")
    except Exception as e:
        print(f"❌ Error talking to Tesseract: {e}")
else:
    print("❌ ERROR: File not found at that path. Please check your installation folder.")