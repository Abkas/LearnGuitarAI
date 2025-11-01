import requests
import os
from bson import ObjectId
from dotenv import load_dotenv
from ..core.database import get_songs_collection

load_dotenv()

HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"
headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}

async def generate_lyrics(song_id: str, current_user: dict):
    """Helper to generate lyrics using Whisper"""
    songs_collection = get_songs_collection()
    song = songs_collection.find_one({
        "_id": ObjectId(song_id),
        "user_id": ObjectId(current_user["_id"])
    })
    
    if not song:
        return
        
    try:
        with open(song["file_path"], "rb") as f:
            audio_data = f.read()
        
        response = requests.post(
            API_URL,
            headers=headers,
            data=audio_data,
            params={
                "task": "transcribe",
                "return_timestamps": True
            }
        )
        
        if response.status_code == 200:
            transcription = response.json()
            songs_collection.update_one(
                {"_id": ObjectId(song_id)},
                {
                    "$set": {
                        "processed": True,
                        "analysis": {
                            "lyrics": transcription.get("text", ""),
                            "chunks": transcription.get("chunks", [])
                        }
                    }
                }
            )
            return transcription
    except Exception as e:
        print(f"Error generating lyrics: {str(e)}")
        songs_collection.update_one(
            {"_id": ObjectId(song_id)},
            {"$set": {"processed": False}}
        )
        return None