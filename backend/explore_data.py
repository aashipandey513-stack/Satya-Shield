from datasets import load_dataset
import numpy as np

print(">>> 🌐 Connecting to Hugging Face Hub...")
print(">>> 📡 Streaming 'Deepfake-Audio-Dataset'...\n")

# We use streaming=True so we don't accidentally download a 50GB file to your Codespace!
dataset = load_dataset("Hemg/Deepfake-Audio-Dataset", split="train", streaming=True)

# Grab just the first 3 audio samples from the cloud
for i, sample in enumerate(dataset.take(3)):
    # Extract the raw physics data
    audio_array = sample['audio']['array']
    sample_rate = sample['audio']['sampling_rate']
    
    # 0 usually means Real (Bonafide), 1 means Fake (Spoof)
    label = sample['label'] 
    verdict = "REAL HUMAN" if label == 0 else "AI DEEPFAKE"
    
    # Calculate physical duration
    duration = round(len(audio_array) / sample_rate, 2)
    
    print(f"--- Audio Sample {i+1} ---")
    print(f"Label:       {verdict} (Class {label})")
    print(f"Sample Rate: {sample_rate} Hz")
    print(f"Duration:    {duration} seconds")
    print(f"Max Amp:     {np.max(audio_array):.4f}")
    print("-" * 25 + "\n")

print("✅ Data pipeline successfully verified!")