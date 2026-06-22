import os
import torch
import torch.nn as nn
from transformers import Wav2Vec2Model
import warnings

# Suppress standard HuggingFace warnings for clean output
warnings.filterwarnings("ignore")

class SatyaShieldProductionModel(nn.Module):
    def __init__(self):
        super().__init__()
        # 1. The Real Brain: Download the massive acoustic feature extractor
        self.wav2vec2 = Wav2Vec2Model.from_pretrained("facebook/wav2vec2-base")
        
        # 2. The Decision Node: Compress the complex audio features into a single Score
        self.classifier = nn.Linear(self.wav2vec2.config.hidden_size, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # Pass the 1-second audio tensor through the massive Meta AI brain
        outputs = self.wav2vec2(x)
        
        # Average out the sequence data into a dense fingerprint
        hidden_states = outputs.last_hidden_state.mean(dim=1)
        
        # Output a final confidence percentage
        return self.sigmoid(self.classifier(hidden_states))

def main():
    os.makedirs("models", exist_ok=True)
    model_path = "models/wav2vec_fake_detector.onnx"
    
    print(">>> 🌐 Contacting Hugging Face Hub...")
    print(">>> 🧠 Downloading Wav2Vec2 Base Model (~380MB). This may take a minute or two...")
    
    # Instantiate and download the model
    model = SatyaShieldProductionModel()
    model.eval()

    # Create the exact tensor shape your main.py currently sends (1 second of 16kHz audio)
    dummy_input = torch.randn(1, 16000, dtype=torch.float32)

    print(">>> ⚙️ Freezing weights and compiling to high-speed ONNX format...")
    torch.onnx.export(
        model,
        dummy_input,
        model_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    print(f"\n✅ MASSIVE SUCCESS! Production AI engine exported to: {model_path}")

if __name__ == "__main__":
    main()