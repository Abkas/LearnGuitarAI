import os
import sys
import librosa
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import CategoricalCrossentropy
from tensorflow.keras.utils import to_categorical

fold = r"C:\Users\DELL\OneDrive\Desktop\OpenCV\audio_data_placeholder"

target_sample_rate = 22050
target_duration = 3.0
n_mfcc = 40
confidence_threshold = 0.7

# --- Data Collection --- #
file_paths = []
labels = []

for root, dirs, files in os.walk(fold):
    for file in files:
        if file.endswith(".wav"):
            file_path = os.path.join(root, file)
            file_paths.append(file_path)
            label = os.path.basename(root)
            labels.append(label)

print(f"Number of files found: {len(file_paths)}")
print(f"First 5 file paths: {file_paths[:5]}")
print(f"First 5 labels: {labels[:5]}")

# --- Audio Preprocessing Function --- #
def process_audio(file_path, target_sample_rate=target_sample_rate, target_duration=target_duration, n_mfcc=n_mfcc):
    """Loads, resamples, pads/truncates, and extracts MFCCs from an audio file."""
    try:
        y, sr = librosa.load(file_path, sr=None)

        if sr != target_sample_rate:
            y = librosa.resample(y, orig_sr=sr, target_sr=target_sample_rate)
            sr = target_sample_rate

        target_length = int(target_duration * sr)
        if len(y) > target_length:
            y = y[:target_length]
        else:
            y = np.pad(y, (0, max(0, target_length - len(y))), "constant")

        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        return mfccs.T

    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        return None

# --- Process all audio files and extract features --- #
features = []
processed_labels = []

for i, file_path in enumerate(file_paths):
    mfccs = process_audio(file_path)
    if mfccs is not None:
        features.append(mfccs)
        processed_labels.append(labels[i])

# Convert to numpy arrays and pad features
max_len = max([f.shape[0] for f in features])
padded_features = []
for f in features:
    pad_width = max_len - f.shape[0]
    padded_features.append(np.pad(f, ((0, pad_width), (0, 0)), "constant"))

features_array = np.array(padded_features)
labels_array = np.array(processed_labels)

# Store class names for inference
CLASS_NAMES = np.unique(labels_array).tolist()
print(f"Detected Class Names: {CLASS_NAMES}")

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features_array, labels_array, test_size=0.2, random_state=42, stratify=labels_array)

print(f"Shape of features array: {features_array.shape}")
print(f"Shape of labels array: {labels_array.shape}")
print(f"Shape of X_train: {X_train.shape}")
print(f"Shape of X_test: {X_test.shape}")
print(f"Shape of y_train: {y_train.shape}")
print(f"Shape of y_test: {y_test.shape}")


input_shape = (X_train.shape[1], X_train.shape[2])
num_classes = len(CLASS_NAMES)

model = Sequential([
    Conv1D(filters=64, kernel_size=5, activation='relu', input_shape=input_shape),
    MaxPooling1D(pool_size=2),
    Dropout(0.3),
    Conv1D(filters=128, kernel_size=5, activation='relu'),
    MaxPooling1D(pool_size=2),
    Dropout(0.3),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(num_classes, activation='softmax')
])

model.summary()


y_train_encoded = to_categorical(np.asarray([np.where(np.array(CLASS_NAMES) == label)[0][0] for label in y_train]), num_classes=num_classes)
y_test_encoded = to_categorical(np.asarray([np.where(np.array(CLASS_NAMES) == label)[0][0] for label in y_test]), num_classes=num_classes)

model.compile(optimizer=Adam(),
              loss=CategoricalCrossentropy(),
              metrics=['accuracy'])

# history = model.fit(X_train, y_train_encoded,
#                     epochs=50,
#                     batch_size=32,
#                     validation_data=(X_test, y_test_encoded))

# # --- Evaluate the Model --- #
# evaluation_results = model.evaluate(X_test, y_test_encoded, verbose=0)
# print(f"Test Loss: {evaluation_results[0]:.4f}")
# print(f"Test Accuracy: {evaluation_results[1]:.4f}")

# # --- Save the Model --- #
# model.save('guitar_chord_model.h5')
# print("Model saved as 'guitar_chord_model.h5'")
