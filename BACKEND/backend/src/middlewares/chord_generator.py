import os
import traceback
from bson import ObjectId
from ..core.database import get_songs_collection
from .strum_generator import generate_strumming

DEMO_CHORDS_OUTPUT = {
    "segments": [
        {"timestamp": [0.0, 9.2], "chord": "B"},
        {"timestamp": [9.2, 18.0], "chord": "Badd11"},
        {"timestamp": [18.0, 27.5], "chord": "F#6"},
        {"timestamp": [27.5, 36.0], "chord": "Emaj7"},
        {"timestamp": [36.0, 43.0], "chord": "B"},
        {"timestamp": [43.0, 53.8], "chord": "Badd11"},
        {"timestamp": [53.8, 63.5], "chord": "F#6"},
        {"timestamp": [63.5, 72.0], "chord": "Emaj7"},
        {"timestamp": [72.0, 80.5], "chord": "B"},
        {"timestamp": [80.5, 88.5], "chord": "Badd11"},
        {"timestamp": [88.5, 95.8], "chord": "F#6"},
        {"timestamp": [95.8, 104.0], "chord": "Emaj7"}
    ]
}


# TODO: Uncomment when ready to integrate your custom chord detection model
# def send_audio_to_chord_model(audio_file_path: str):
#     """
#     Function to send audio to your custom chord detection model.
#     
#     Args:
#         audio_file_path: Path to the audio file (or Cloudinary URL)
#         
#     Returns:
#         Dictionary with 'segments' containing timestamped chord changes
#         Format: {"segments": [{"timestamp": [start, end], "chord": "C"}, ...]}
#     
#     Implementation steps:
#     - Load your custom chord detection model
#     - Process the audio file
#     - Return chord progression with timestamps
#     """
#     print(f"send_audio_to_chord_model: processing {audio_file_path}")
#     
#     # Your model code here
#     # model = load_chord_detection_model()
#     # result = model.detect_chords(audio_file_path)
#     
#     return result


def get_demo_chords():

    print("get_demo_chords: returning demo chord output")
    return DEMO_CHORDS_OUTPUT


def generate_chords(song_id: str, current_user: dict):

    songs_collection = get_songs_collection()
    print(f"generate_chords: started for song_id={song_id} user={current_user}")
    
    song = songs_collection.find_one({"_id": ObjectId(song_id)})
    if not song:
        print(f"generate_chords: no song found with id={song_id}")
        return

    stored_user_id = song.get("user_id")
    if str(stored_user_id) != str(current_user["_id"]):
        print(f"generate_chords: song found but user mismatch: stored={stored_user_id} current={current_user['_id']}")
        return
        
    try:
        file_path = song.get("file_path")
        if not file_path:
            print(f"generate_chords: no file_path found for song")
            return
        
        print(f"generate_chords: processing song from {file_path}")
        
        # Get demo chords (replace with custom model call later)
        result = get_demo_chords()
        # TODO: Uncomment when custom model is ready
        # For Cloudinary URLs, you'll need to download the file first or process the URL directly
        # result = send_audio_to_chord_model(file_path)
        
        # Extract chord segments from model result
        if result and isinstance(result, dict):
            segments = result.get("segments", [])
            
            print("--- Chord Detection Results ---")
            for segment in segments:
                timestamp = segment.get("timestamp", [0, 0])
                chord = segment.get("chord", "")
                print(f"[{timestamp[0]:.1f} - {timestamp[1]:.1f}] {chord}")
            print("--- End chord detection ---")
            
            # Convert segments to DB format
            parsed_segments = []
            for segment in segments:
                timestamp = segment.get("timestamp", [0, 0])
                chord = segment.get("chord", "")
                
                parsed_segments.append({
                    "start": float(timestamp[0]),
                    "end": float(timestamp[1]),
                    "chord": chord
                })
            
            # Build chords object for DB
            chords_data = {
                "segments": parsed_segments
            }
            
            # Update song with chord data
            songs_collection.update_one(
                {"_id": ObjectId(song_id)},
                {"$set": {"chords": chords_data}}
            )
            
            print(f"generate_chords: successfully saved {len(parsed_segments)} chord segments to DB")
            
            # Start strumming pattern generation
            print(f"generate_chords: triggering strumming generation for song_id={song_id}")
            generate_strumming(song_id, current_user)
            
        else:
            print("generate_chords: no valid result from chord detection")
            
    except Exception as e:
        print(f"generate_chords: error - {str(e)}")
        traceback.print_exc()
