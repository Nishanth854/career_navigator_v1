from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routes.upload_routes import router as upload_router
from routes.match_routes import router as match_router
from routes.chat_routes import router as chat_router
from routes.news_routes import router as news_router
from routes.notification_routes import router as notification_router
import uvicorn
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

app = FastAPI(title="StudentMate")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect your logic routers
app.include_router(upload_router, prefix="/api/v1")
app.include_router(match_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(news_router, prefix="/api/v1")
app.include_router(notification_router, prefix="/api/v1")

@app.get("/api/health")
def health():
    return {"status": "AI Engine Online"}

# Serve Static Files (The built React app)
# This assumes the 'static' folder exists (created by Dockerfile)
if os.path.exists("./static"):
    # Serve assets directory directly for performance
    if os.path.exists("./static/assets"):
        app.mount("/assets", StaticFiles(directory="./static/assets"), name="assets")

    # Catch-all route to serve files or index.html for SPA
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Don't intercept API calls
        if full_path.startswith("api/"):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="API endpoint not found")
            
        file_path = os.path.join("./static", full_path)
        
        # If the file exists (like favicon.ico, robots.txt), serve it
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Otherwise, serve the React index.html
        return FileResponse("./static/index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"🚀 Launching StudentMate Engine on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
