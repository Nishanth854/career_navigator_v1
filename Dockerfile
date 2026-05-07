# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

# Accept build arguments for Supabase (Vite needs these at build time)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# Stage 2: Build Backend & Final Image
FROM python:3.10-bullseye
WORKDIR /app

# Switch to root to install system packages
USER root

# Install system dependencies for OCR and OpenCV with retry logic
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Download the spaCy model
RUN python -m spacy download en_core_web_sm

# Copy backend source code
COPY backend/ ./

# Copy built frontend assets from Stage 1 to a directory FastAPI can serve
COPY --from=frontend-builder /app/dist ./static

# Expose the port Hugging Face Spaces expects
EXPOSE 7860

# Start the server
# We use 0.0.0.0 to allow external connections
CMD ["uvicorn", "career_engine_server:app", "--host", "0.0.0.0", "--port", "7860"]

# Force rebuild to pick up Vite env vars
