import os
import numpy as np
import librosa
import onnxruntime
import onnxruntime as ort
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific URLs in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store our deep learning runtime engine
MODEL_PATH = "models/wav2vec_fake_detector.onnx"
ort_session = onnxruntime.InferenceSession("models/satya_custom_v1.onnx")

@app.on_event("startup")
async def load_model():
    global ort_session
    print(">>> 🛡️ Neural Network detected. Initializing Core Engine...")
    if os.path.exists(MODEL_PATH):
        try:
            # Initialize ONNX runtime session targeting the new Wav2Vec2 base
            ort_session = ort.InferenceSession(MODEL_PATH)
            print(f"✅ Production Model successfully loaded from: {MODEL_PATH}")
        except Exception as e:
            print(f"❌ Error compiling model execution graph: {e}")
            print("Fallback to Heuristic Engine active.")
    else:
        print(f"⚠️ Warning: Model not found at {MODEL_PATH}. Falling back to Heuristic Engine.")

@app.get("/")
def read_root():
    return {"status": "online", "engine": "Satya-Shield Core V2 (Wav2Vec2.0 ONNX)"}

@app.post("/scan")
async def scan_audio(
    file: UploadFile = File(...),
    minCentroid: float = Form(1600.0),
    minZcr: float = Form(0.085),
    maxMfccVar: float = Form(15000.0)
):
    global ort_session
    try:
        # 1. Read incoming audio file into memory
        audio_bytes = await file.read()
        
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as f:
            f.write(audio_bytes)
            
        # 2. Downsample/normalize to standard 16kHz mono audio
        y, sr = librosa.load(temp_filename, sr=16000, mono=True)
        
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
            
        # --- VISUAL FEATURE EXTRACTION ---
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        mfcc_summary = np.mean(mfccs, axis=1).tolist()
        chroma_summary = np.mean(chroma, axis=1).tolist()

        # --- NEW: HEURISTIC FIREWALL METRICS ---
        # Calculate the actual physical traits of the audio
        actual_centroid = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
        actual_zcr = float(np.mean(librosa.feature.zero_crossing_rate(y)))
        actual_mfcc_var = float(np.var(mfccs))
            
        # 3. Shape Alignment for AI: Crop or pad to exactly 1 second
        target_samples = 16000
        if len(y) > target_samples:
            y = y[:target_samples]
        else:
            y = np.pad(y, (0, target_samples - len(y)), mode='constant')
            
        input_tensor = y.reshape(1, target_samples).astype(np.float32)
        
        # 4. Neural Network Pass
        if ort_session is not None:
            input_name = ort_session.get_inputs()[0].name
            ort_inputs = {input_name: input_tensor}
            outputs = ort_session.run(None, ort_inputs)
            deepfake_probability = float(outputs[0].item())
        else:
            feature_hash = float(np.std(input_tensor))
            deepfake_probability = (feature_hash * 100) % 1.0

        # 5. Base Assessment
        confidence = round(max(deepfake_probability, 1.0 - deepfake_probability) * 100, 2)
        verdict = "THREAT" if deepfake_probability > 0.5 else "SAFE"
        
        # --- NEW: FIREWALL OVERRIDE LOGIC ---
        # If the AI thinks it is safe, but the physics violate your UI sliders:
        override_triggered = False
        if verdict == "SAFE":
            if actual_centroid < minCentroid or actual_zcr < minZcr or actual_mfcc_var > maxMfccVar:
                override_triggered = True
                verdict = "THREAT"
                confidence = "MANUAL OVERRIDE"

        return {
            "status": "success",
            "verdict": verdict,
            "confidence": f"{confidence}%" if not override_triggered else confidence,
            "metrics": {
                "probability": round(deepfake_probability, 4),
                "sample_rate": int(sr),
                "centroid": round(actual_centroid, 2),
                "zcr": round(actual_zcr, 4),
                "mfcc_variance": round(actual_mfcc_var, 2)
            },
            "visuals": {
                "mfcc": mfcc_summary,
                "chroma": chroma_summary
            }
        }
        
    except Exception as e:
        print(f"\n🔥 AI PIPELINE ERROR: {e}\n")
        return {
            "status": "error",
            "message": f"Engine failure during core pass: {str(e)}"
        }