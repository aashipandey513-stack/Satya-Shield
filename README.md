# Satya-Shield 🛡️

Satya-Shield is a real-time, multimodal synthetic media detection system. This repository contains a working Minimum Viable Product (MVP) designed to extract mathematical acoustic features and spatial-temporal anomalies to identify AI-generated deepfakes and voice clones.

### 🧠 The Multimodal Architecture
Unlike standard wrapper applications, Satya-Shield processes raw data using a custom Machine Learning feature extraction pipeline with a dynamic routing engine:

1. **Frontend Interface:** A highly responsive, dark-mode web dashboard built with Vite, React, and Tailwind CSS v4.
2. **Asynchronous Backend:** A lightweight FastAPI server designed for rapid file buffering and dynamic media routing.
3. **Acoustic Extraction Engine:** Utilizes `librosa` to break down audio waves into Mel-frequency cepstral coefficients (MFCCs) and analyze Spectral Centroids to detect the high-frequency smoothing characteristic of synthetic voices.
4. **Visual Variance Engine:** Utilizes `OpenCV` to deconstruct video containers frame-by-frame, calculating Laplacian edge variances to detect the micro-jitters and boundary blurring typical of generative face-swaps.

### 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS v4, Vite
* **Backend:** Python, FastAPI, Uvicorn, Python-Multipart
* **Computer Vision & ML:** OpenCV (Headless), Librosa, NumPy

### 🚀 Running Locally
To run this application on your own machine:

**1. Start the Neural Engine (Backend)**
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

**2. Start the UI (Frontend)**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
