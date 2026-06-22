<p align="center">
  <img src="frontend/public/logo.png" alt="Satya-Shield Logo" width="200"/>
</p>

# Satya-Shield 🛡️
**A Real-Time Deepfake and Voice Clone Detection Engine**
Satya-Shield is a real-time, multimodal synthetic media detection system. This repository contains a working Minimum Viable Product (MVP) designed to extract mathematical acoustic features and spatial-temporal anomalies to identify AI-generated deepfakes and voice clones.

## 🚀 Features

*   **Multimodal Detection Pipeline:** Processes both audio and video inputs for comprehensive synthetic media detection.
*   **Heuristic Audio Firewall:** Analyzes audio files using spectral and temporal features to catch basic synthetic artifacts:
    *   **Spectral Centroid:** Detects high-frequency smoothing common in TTS generation.
    *   **Zero-Crossing Rate (ZCR):** Analyzes vocal cord friction anomalies.
    *   **MFCC Variance:** Identifies mechanical and robotic dynamic ranges.
*   **Neural Inference Engine:** Built-in ONNX runtime integration for deploying state-of-the-art Deep Learning models directly on the backend.
*   **Graceful Fallback Logic:** Automatically defaults to the heuristic firewall if neural weights are unavailable, ensuring zero downtime.

Unlike standard wrapper applications, Satya-Shield processes raw data using a custom Machine Learning feature extraction pipeline with a dynamic routing engine:

1. **Frontend Interface:** A highly responsive, dark-mode web dashboard built with Vite, React, and Tailwind CSS v4.
2. **Asynchronous Backend:** A lightweight FastAPI server designed for rapid file buffering and dynamic media routing.
3. **Acoustic Extraction Engine:** Utilizes `librosa` to break down audio waves into Mel-frequency cepstral coefficients (MFCCs) and analyze Spectral Centroids to detect the high-frequency smoothing characteristic of synthetic voices.
4. **Visual Variance Engine:** Utilizes `OpenCV` to deconstruct video containers frame-by-frame, calculating Laplacian edge variances to detect the micro-jitters and boundary blurring typical of generative face-swaps.

### 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS v4, Vite
* **Backend:** Python, FastAPI, Uvicorn, Python-Multipart
* **Audio/Signal Processing:** Librosa, NumPy
* **Computer Vision:** OpenCV
* **Deep Learning Runtime:** ONNX Runtime

## ⚙️ Installation & Setup

### Backend
1. Navigate to the backend directory: `cd backend`
2. Activate the virtual environment: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Start the server: `uvicorn main:app --reload`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## 🧠 Architecture Overview
Satya-Shield operates on a dual-layer security model. First, media is passed through a lightweight mathematical thresholding system (Librosa/OpenCV) for rapid artifact detection. Next, the pipeline routes the data to an ONNX-powered Deep Learning session for complex, non-linear pattern recognition, successfully countering advanced generative models.