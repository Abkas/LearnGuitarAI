import os
import traceback
from bson import ObjectId
from ..core.database import get_songs_collection

DEMO_STRUMMING_OUTPUT = {
    "pattern": "D D U U D U", 
    "bpm": 87,  
    "segments": [
        {"timestamp": [0.0, 9.2], "pattern": "D D U U D U", "intensity": "medium"},
        {"timestamp": [9.2, 18.0], "pattern": "D D U U D U", "intensity": "medium"},
        {"timestamp": [18.0, 27.5], "pattern": "D D U U D U", "intensity": "medium-high"},
        {"timestamp": [27.5, 36.0], "pattern": "D D U U D U", "intensity": "medium"},
        {"timestamp": [36.0, 43.0], "pattern": "D D U U D U", "intensity": "soft"},
        {"timestamp": [43.0, 53.8], "pattern": "D D U U D U", "intensity": "medium"},
        {"timestamp": [53.8, 63.5], "pattern": "D D U U D U", "intensity": "medium-high"},
        {"timestamp": [63.5, 72.0], "pattern": "D D U U D U", "intensity": "medium"},
        {"timestamp": [72.0, 80.5], "pattern": "D D U U D U", "intensity": "high"},
        {"timestamp": [80.5, 88.5], "pattern": "D D U U D U", "intensity": "high"},
        {"timestamp": [88.5, 95.8], "pattern": "D D U U D U", "intensity": "medium"},
        {"timestamp": [95.8, 104.0], "pattern": "D D U U D U", "intensity": "soft"}
    ]
}


# TODO: Uncomment when ready to integrate your custom strumming detection model
# def send_audio_to_strumming_model(audio_file_path: str):
#     """
#     Function to send audio to your custom strumming pattern detection model.
#     
#     Args:
#         audio_file_path: Path to the audio file (or Cloudinary URL)
#         
#     Returns:
#         Dictionary with strumming pattern info and timestamped segments
#         Format: {
#             "pattern": "D D U U D U",
#             "bpm": 87,
#             "segments": [{"timestamp": [start, end], "pattern": "...", "intensity": "..."}]
#         }
#     
#     Implementation steps:
#     - Load your custom strumming detection model
#     - Analyze rhythm and strumming patterns from audio
#     - Return pattern with timestamps and intensity levels
#     """
#     print(f"send_audio_to_strumming_model: processing {audio_file_path}")
#     
#     # Your model code here
#     # model = load_strumming_detection_model()
#     # result = model.detect_strumming(audio_file_path)
#     
#     return result


def get_demo_strumming():
    print("get_demo_strumming: returning demo strumming output")
    return DEMO_STRUMMING_OUTPUT


def generate_strumming(song_id: str, current_user: dict):

    songs_collection = get_songs_collection()
    print(f"generate_strumming: started for song_id={song_id} user={current_user}")
    
    song = songs_collection.find_one({"_id": ObjectId(song_id)})
    if not song:
        print(f"generate_strumming: no song found with id={song_id}")
        return

    stored_user_id = song.get("user_id")
    if str(stored_user_id) != str(current_user["_id"]):
        print(f"generate_strumming: song found but user mismatch: stored={stored_user_id} current={current_user['_id']}")
        return
        
    try:
        file_path = song.get("file_path")
        if not file_path:
            print(f"generate_strumming: no file_path found for song")
            return
        
        print(f"generate_strumming: processing song from {file_path}")
        
        # Get demo strumming (replace with custom model call later)
        result = get_demo_strumming()
        # TODO: Uncomment when custom model is ready
        # For Cloudinary URLs, you'll need to download the file first or process the URL directly
        # result = send_audio_to_strumming_model(file_path)
        
        # Extract strumming data from model result
        if result and isinstance(result, dict):
            pattern = result.get("pattern", "")
            bpm = result.get("bpm", 0)
            segments = result.get("segments", [])
            
            print("--- Strumming Pattern Detection Results ---")
            print(f"Main Pattern: {pattern}")
            print(f"BPM: {bpm}")
            for segment in segments:
                timestamp = segment.get("timestamp", [0, 0])
                seg_pattern = segment.get("pattern", "")
                intensity = segment.get("intensity", "medium")
                print(f"[{timestamp[0]:.1f} - {timestamp[1]:.1f}] {seg_pattern} ({intensity})")
            print("--- End strumming detection ---")
            
            # Convert segments to DB format
            parsed_segments = []
            for segment in segments:
                timestamp = segment.get("timestamp", [0, 0])
                seg_pattern = segment.get("pattern", "")
                intensity = segment.get("intensity", "medium")
                
                parsed_segments.append({
                    "start": float(timestamp[0]),
                    "end": float(timestamp[1]),
                    "pattern": seg_pattern,
                    "intensity": intensity
                })
            
            # Build strumming object for DB
            strumming_data = {
                "pattern": pattern,
                "bpm": bpm,
                "segments": parsed_segments
            }
            
            # Update song with strumming data
            songs_collection.update_one(
                {"_id": ObjectId(song_id)},
                {"$set": {"strumming": strumming_data}}
            )
            
            print(f"generate_strumming: successfully saved strumming pattern with {len(parsed_segments)} segments to DB")
            
        else:
            print("generate_strumming: no valid result from strumming detection")
            
    except Exception as e:
        print(f"generate_strumming: error - {str(e)}")
        traceback.print_exc()
