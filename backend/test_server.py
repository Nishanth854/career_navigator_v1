from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Test successful"}

if __name__ == "__main__":
    print("Trying to start test server...")
    uvicorn.run(app, host="0.0.0.0", port=8001)