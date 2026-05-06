# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend & Final Image
FROM python:3.9-slim
WORKDIR /app

# Install system dependencies for OCR and OpenCV
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./

# Copy built frontend assets from Stage 1 to a directory FastAPI can serve
COPY --from=frontend-builder /app/frontend/dist ./static

# Expose the port Hugging Face Spaces expects
EXPOSE 7860

# Start the server
# We use 0.0.0.0 to allow external connections
CMD ["uvicorn", "career_engine_server:app", "--host", "0.0.0.0", "--port", "7860"]
