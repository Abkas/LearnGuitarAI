import os
import traceback
from bson import ObjectId
from ..core.database import get_songs_collection

# Demo song output - Full length example with realistic timestamps
DEMO_LYRICS_OUTPUT = {
    "text": "Look at the stars, look how they shine for you, and everything you do. Yeah, they were all yellow. I came along, I wrote a song for you, and all the things you do. And it was called Yellow. So then I took my turn, oh what a thing to have done. And it was all yellow. Your skin, oh yeah your skin and bones, turn into something beautiful. Do you know, you know I love you so, you know I love you so. I swam across, I jumped across for you, oh what a thing to do. Cause you were all yellow. I drew a line, I drew a line for you, oh what a thing to do. And it was all yellow. Your skin, oh yeah your skin and bones, turn into something beautiful. Do you know, for you I'd bleed myself dry, for you I'd bleed myself dry. It's true, look how they shine for you, look how they shine for you. Look how they shine for, look how they shine for you. Look how they shine for you, look how they shine. Look at the stars, look how they shine for you, and all the things that you do.",
    "chunks": [
        {"timestamp": [0.0, 3.5], "text": "Look at the stars, look how they shine for you"},
        {"timestamp": [3.5, 6.8], "text": "and everything you do"},
        {"timestamp": [6.8, 9.2], "text": "Yeah, they were all yellow"},
        {"timestamp": [9.2, 12.0], "text": "I came along, I wrote a song for you"},
        {"timestamp": [12.0, 15.3], "text": "and all the things you do"},
        {"timestamp": [15.3, 18.0], "text": "And it was called Yellow"},
        {"timestamp": [18.0, 21.5], "text": "So then I took my turn"},
        {"timestamp": [21.5, 24.8], "text": "oh what a thing to have done"},
        {"timestamp": [24.8, 27.5], "text": "And it was all yellow"},
        {"timestamp": [27.5, 32.0], "text": "Your skin, oh yeah your skin and bones"},
        {"timestamp": [32.0, 35.8], "text": "turn into something beautiful"},
        {"timestamp": [35.8, 39.5], "text": "Do you know, you know I love you so"},
        {"timestamp": [39.5, 43.0], "text": "you know I love you so"},
        {"timestamp": [43.0, 47.2], "text": "I swam across, I jumped across for you"},
        {"timestamp": [47.2, 50.5], "text": "oh what a thing to do"},
        {"timestamp": [50.5, 53.8], "text": "Cause you were all yellow"},
        {"timestamp": [53.8, 57.5], "text": "I drew a line, I drew a line for you"},
        {"timestamp": [57.5, 60.8], "text": "oh what a thing to do"},
        {"timestamp": [60.8, 63.5], "text": "And it was all yellow"},
        {"timestamp": [63.5, 68.0], "text": "Your skin, oh yeah your skin and bones"},
        {"timestamp": [68.0, 71.8], "text": "turn into something beautiful"},
        {"timestamp": [71.8, 76.0], "text": "Do you know, for you I'd bleed myself dry"},
        {"timestamp": [76.0, 80.5], "text": "for you I'd bleed myself dry"},
        {"timestamp": [80.5, 84.8], "text": "It's true, look how they shine for you"},
        {"timestamp": [84.8, 88.5], "text": "look how they shine for you"},
        {"timestamp": [88.5, 92.0], "text": "Look how they shine for, look how they shine for you"},
        {"timestamp": [92.0, 95.8], "text": "Look how they shine for you, look how they shine"},
        {"timestamp": [95.8, 100.5], "text": "Look at the stars, look how they shine for you"},
        {"timestamp": [100.5, 104.0], "text": "and all the things that you do"}
    ]
}


# TODO: Uncomment when ready to integrate your custom model
# def send_audio_to_custom_model(audio_file_path: str):
#     """
#     Function to send audio to your custom ASR model.
#     
#     Args:
#         audio_file_path: Path to the audio file
#         
#     Returns:
#         Dictionary with 'text' (full transcript) and 'chunks' (timestamped segments)
#         
#     Implementation steps:
#     - Load your custom Whisper/ASR model
#     - Process the audio file
#     - Return transcription with timestamps in format:
#       {"text": "full lyrics", "chunks": [{"timestamp": [start, end], "text": "..."}]}
#     """
#     print(f"send_audio_to_custom_model: processing {audio_file_path}")
#     
#     # Your model code here
#     # model = load_your_model()
#     # result = model.transcribe(audio_file_path)
#     
#     return result


def get_demo_lyrics():
    print("get_demo_lyrics: returning demo output")
    return DEMO_LYRICS_OUTPUT

def generate_lyrics(song_id: str, current_user: dict):

    songs_collection = get_songs_collection()
    print(f"generate_lyrics: started for song_id={song_id} user={current_user}")
    
    # Fetch song and validate ownership
    song = songs_collection.find_one({"_id": ObjectId(song_id)})
    if not song:
        print(f"generate_lyrics: no song found with id={song_id}")
        return

    stored_user_id = song.get("user_id")
    if str(stored_user_id) != str(current_user["_id"]):
        print(f"generate_lyrics: song found but user mismatch: stored={stored_user_id} current={current_user['_id']}")
        return
        
    try:
        if not os.path.exists(song["file_path"]):
            print(f"generate_lyrics: audio file not found at {song['file_path']}")
            songs_collection.update_one({"_id": ObjectId(song_id)}, {"$set": {"processed": False}})
            return
        
        print(f"generate_lyrics: processing song {song['file_path']}")
        
        # Get demo lyrics (replace with custom model call later)
        result = get_demo_lyrics()
        # TODO: Uncomment when custom model is ready
        # result = send_audio_to_custom_model(song["file_path"])
        
        # Extract transcription and segments from custom model result
        if result and isinstance(result, dict):
            transcription = result.get("text", "")
            chunks = result.get("chunks", [])
            
            print("--- Custom Model Transcription ---")
            print(transcription)
            print("--- Timestamped Segments ---")
            for chunk in chunks:
                timestamp = chunk.get("timestamp", [0, 0])
                text = chunk.get("text", "")
                print(f"[{timestamp[0]:.1f} - {timestamp[1]:.1f}] {text}")
            print("--- End transcription ---")
            
            # Convert chunks to segments format for DB
            parsed_segments = []
            for chunk in chunks:
                timestamp = chunk.get("timestamp", [0, 0])
                parsed_segments.append({
                    "start": timestamp[0] if len(timestamp) > 0 else 0,
                    "end": timestamp[1] if len(timestamp) > 1 else 0,
                    "text": chunk.get("text", "")
                })
            
            # Prepare lyrics object for new Song model structure
            lyrics_obj = {
                "text": transcription,
                "segments": parsed_segments
            }

            # Save to DB using new structure (lyrics, chords, strumming separate)
            songs_collection.update_one(
                {"_id": ObjectId(song_id)},
                {"$set": {
                    "processed": True,
                    "lyrics": lyrics_obj,
                    "chords": None,  # To be filled by chord detection
                    "strumming": None  # To be filled by strumming detection
                }}
            )
            return transcription
        else:
            print("generate_lyrics: no valid result from custom model")
            songs_collection.update_one(
                {"_id": ObjectId(song_id)},
                {"$set": {"processed": False}}
            )
            return None
            
    except Exception as e:
        print("Error generating lyrics:")
        traceback.print_exc()
        songs_collection.update_one(
            {"_id": ObjectId(song_id)},
            {"$set": {"processed": False}}
        )
        return None
