
import sounddevice as sd
import numpy as np
import librosa
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model

# Audio settings
SAMPLERATE = 22050  # samples per second, matching model training
DURATION = 3       # seconds, matching model training
BLOCKSIZE = int(SAMPLERATE * DURATION) # Audio block size for 3 seconds of audio
CHANNELS = 1         # mono audio
N_MFCC = 40          # Number of MFCCs, matching model training
MAX_AUDIO_LEN = 130  # Max time steps for MFCCs, matching model training

# Path to your trained model
MODEL_PATH = 'guitar_chord_model.h5'

# Placeholder for chord names - **YOU MUST REPLACE THIS WITH YOUR ACTUAL CHORD LABELS IN THE CORRECT ORDER**
CLASS_NAMES = ['Chord0', 'Chord1', 'Chord2', 'Chord3', 'Chord4', 'Chord5', 'Chord6', 'Chord7']

try:
    # Load the trained model
    model = load_model(MODEL_PATH)
    print(f"Successfully loaded model from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Removed CHORD_TEMPLATES as we are using a trained model

def get_audio_input():
    print("Starting audio stream...")
    with sd.InputStream(samplerate=SAMPLERATE, channels=CHANNELS, blocksize=BLOCKSIZE) as stream:
        while True:
            audio_block, overflowed = stream.read(BLOCKSIZE)
            if overflowed:
                print("Audio buffer overflowed!")
            yield audio_block.flatten()

def process_audio(audio_buffer):
    # Resample is not needed here as sounddevice stream is already at SAMPLERATE
    # Pad or truncate to target duration
    target_length = int(DURATION * SAMPLERATE)
    if len(audio_buffer) > target_length:
        y = audio_buffer[:target_length]
    else:
        y = np.pad(audio_buffer, (0, max(0, target_length - len(audio_buffer))), "constant")

    # Extract MFCCs
    mfccs = librosa.feature.mfcc(y=y, sr=SAMPLERATE, n_mfcc=N_MFCC)
    
    # Transpose to have time steps as rows
    mfccs = mfccs.T

    # Pad/truncate MFCCs to MAX_AUDIO_LEN
    if mfccs.shape[0] < MAX_AUDIO_LEN:
        pad_width = MAX_AUDIO_LEN - mfccs.shape[0]
        mfccs = np.pad(mfccs, ((0, pad_width), (0, 0)), "constant")
    elif mfccs.shape[0] > MAX_AUDIO_LEN:
        mfccs = mfccs[:MAX_AUDIO_LEN, :]
    
    return mfccs

def recognize_chord(features):
    if model is None:
        return "Error: Model not loaded."

    # Add a batch dimension to the features
    features = np.expand_dims(features, axis=0)

    # Make a prediction
    predictions = model.predict(features, verbose=0)
    
    # Get the predicted class index
    predicted_class_index = np.argmax(predictions)
    
    # Get the confidence for the predicted class
    confidence = predictions[0][predicted_class_index]

    # Set a confidence threshold for recognition
    CONFIDENCE_THRESHOLD = 0.7 # This can be tuned

    if confidence >= CONFIDENCE_THRESHOLD:
        return CLASS_NAMES[predicted_class_index]
    else:
        return "Unknown"

def main():
    print("Initializing...")

    # Webcam setup
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    audio_generator = get_audio_input()

    while True:
        # Read audio
        audio_block = next(audio_generator)
        processed_features = process_audio(audio_block)
        current_chord = recognize_chord(processed_features)

        # Read webcam feed
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame.")
            break

        # Overlay chord info on video feed
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, f"Chord: {current_chord}", (50, 50), font, 1, (0, 255, 0), 2, cv2.LINE_AA)

        # Display the frame
        cv2.imshow('Guitar Chord Recognition', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
