import smtplib
import os
from dotenv import load_dotenv

# Load exactly the same .env file the backend uses
load_dotenv(override=True)

sender = os.getenv("SENDER_EMAIL")
password = os.getenv("GMAIL_APP_PASSWORD")

print("=== CareerNav SMTP Diagnostic Tool ===")
print(f"Checking credentials loaded from .env:")
print(f"Email: '{sender}'")
print(f"Password Length: {len(password) if password else 0} characters")
print("--------------------------------------")

try:
    print("Connecting to Google SMTP server...")
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.ehlo()
    print("Attempting login...")
    server.login(sender, password)
    print("\n✅ SUCCESS! Google accepted your App Password.")
    server.quit()
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ AUTHENTICATION FAILED: {e}")
    print("\nDiagnosis: Google explicitly rejected this combination of Email and Password.")
    print("This means one of two things is happening:")
    print("1. You generated this App Password on your PERSONAL Google account, but you are trying to use it with 'careernavai01@gmail.com'. (The password must be generated while logged into careernavai01@gmail.com)")
    print("2. The careernavai01@gmail.com account does not have 2-Step Verification fully turned on.")
except Exception as e:
    print(f"\n❌ UNKNOWN ERROR: {e}")
