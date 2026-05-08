from fastapi import APIRouter
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
try:
    from twilio.rest import Client
except ImportError:
    Client = None

router = APIRouter()
load_dotenv()

@router.post("/send-alert")
async def send_alert(data: dict):
    # Absolute path to .env to guarantee it loads regardless of where the user ran the server
    current_dir = os.path.dirname(os.path.realpath(__file__))
    env_path = os.path.join(current_dir, "..", ".env")
    load_dotenv(dotenv_path=env_path, override=True)
    
    email = data.get("email")
    phone = data.get("phone")
    message = data.get("message", "A new scheme matching your profile has been found by StudentMate AI!")
    
    responses = []
    
    # Send Email
    if email:
        try:
            # Need GMAIL_APP_PASSWORD and SENDER_EMAIL in .env
            sender = os.getenv("SENDER_EMAIL")
            password = os.getenv("GMAIL_APP_PASSWORD")
            
            if sender and password:
                msg = MIMEMultipart()
                msg['From'] = sender
                msg['To'] = email
                msg['Subject'] = "StudentMate AI Alert: New Opportunity!"
                
                html = f"""
                <html>
                  <body style="font-family: Arial; background-color: #f4f4f4; padding: 20px;">
                    <div style="background-color: white; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">StudentMate AI</h2>
                        <p><strong>Alert!</strong></p>
                        <p>{message}</p>
                        <a href="http://localhost:5173/updates" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Scheme</a>
                    </div>
                  </body>
                </html>
                """
                msg.attach(MIMEText(html, 'html'))
                
                server = smtplib.SMTP('smtp.gmail.com', 587, timeout=3)
                server.starttls()
                server.login(sender, password)
                server.send_message(msg)
                server.quit()
                responses.append("Email sent successfully.")
            else:
                responses.append(f"Email failed: No sender credentials in .env (Currently checking SENDER_EMAIL={sender})")
        except Exception as e:
            responses.append(f"Email error for {sender}: {str(e)}")
            
    # Send SMS
    if phone:
        try:
            if not Client:
                responses.append("SMS failed: 'twilio' package not installed.")
            else:
                account_sid = os.getenv("TWILIO_ACCOUNT_SID")
                auth_token = os.getenv("TWILIO_AUTH_TOKEN")
                twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
                
                if account_sid and auth_token and twilio_number:
                    client = Client(account_sid, auth_token)
                    client.messages.create(
                        body=f"StudentMate AI Alert: {message}",
                        from_=twilio_number,
                        to=phone
                    )
                    responses.append("SMS sent successfully.")
                else:
                    responses.append("SMS failed: Twilio credentials missing in .env")
        except Exception as e:
            responses.append(f"SMS error: {str(e)}")
            
    return {"status": "success", "logs": responses}
