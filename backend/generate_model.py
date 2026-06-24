import os
import torch
import torch.nn as nn

# Define a minimal network structure matching your main.py input expectations
class DeepfakeAudioClassifier(nn.Module):
    def __init__(self):
        super(DeepfakeAudioClassifier, self).__init__()
        # Accepts 16,000 audio samples and outputs a single probability score
        self.classifier = nn.Sequential(
            nn.Linear(16000, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.classifier(x)

def main():
    # Ensure the target directory exists
    os.makedirs("models", exist_ok=True)
    
    # Initialize the model structure
    model = DeepfakeAudioClassifier()
    model.eval()  # Set to evaluation mode

    # Create a dummy tensor representing 1 second of 16kHz audio data
    dummy_input = torch.randn(1, 16000, dtype=torch.float32)
    
    # Export the architecture to a valid ONNX graph
    model_path = "models/wav2vec_fake_detector.onnx"
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
    print(f"✅ Success! Mathematically valid ONNX graph compiled at: {model_path}")

if __name__ == "__main__":
    main()