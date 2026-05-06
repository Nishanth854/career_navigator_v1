import requests
import json

url = "http://127.0.0.1:8001/api/v1/manual-valuation"
payload = {
    "name": "Test User",
    "department": "Computer Science",
    "college": "Test College",
    "gpa": "8.5",
    "year": "3",
    "semester": "5",
    "arrears": "0",
    "skills": "Python, React",
    "certifications": "AWS",
    "community": "OC"
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    data = response.json()
    
    print("Keys in response:", list(data.keys()))
    if "ai_strategy" in data:
        print("AI Strategy:", data["ai_strategy"])
    if "ai_recommendations" in data:
        print("AI Recommendations Keys:", list(data["ai_recommendations"].keys()))
except Exception as e:
    print("Error:", e)
