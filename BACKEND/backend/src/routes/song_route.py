from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from ..core.database import get_songs_collection
from ..middlewares.auth import get_current_user
from ..middlewares.lyrics_generator import generate_lyrics
from ..models.song_model import Song
import os
import shutil
from datetime import datetime
from bson import ObjectId

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload")
async def upload_song(
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    file: UploadFile = File(...)
):
    title = os.path.splitext(file.filename)[0]
    
    # Save the file locally
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    song = Song(
        title=title,
        file_path=file_path,
        user_id=ObjectId(current_user["_id"]),
        processed=False,  # Initially not processed by AI
        analysis=None    # No AI analysis yet
    )
    
    try:
        songs_collection = get_songs_collection()
        result = songs_collection.insert_one(song.dict(by_alias=True))
        song.id = result.inserted_id
        
        # Start lyrics generation in the background
        background_tasks.add_task(generate_lyrics, str(result.inserted_id), current_user)
        
        return {
            "message": "Song uploaded successfully. Lyrics generation started.",
            "song_info": {
                "id": str(result.inserted_id),
                "title": title,
                "file_path": file_path,
                "processed": False,
                "lyrics_status": "processing"
            }
        }
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to save song metadata: {str(e)}")

@router.get("/lyrics/{song_id}")
async def get_lyrics(
    song_id: str, 
    regenerate: bool = False,
    current_user: dict = Depends(get_current_user)
):
    """
    Get lyrics for a song. Can optionally force regeneration of lyrics.
    """
    songs_collection = get_songs_collection()
    song = songs_collection.find_one({
        "_id": ObjectId(song_id),
        "user_id": ObjectId(current_user["_id"])
    })
    
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    
    # If lyrics exist and no regeneration requested, return them
    if song.get("processed") and song.get("analysis") and not regenerate:
        return {
            "message": "Lyrics retrieved successfully",
            "song_id": song_id,
            "analysis": song["analysis"]
        }
    
    # If regeneration requested or no lyrics exist, generate new ones
    await generate_lyrics(song_id, current_user)
    
    return {
        "message": "Lyrics generation started",
        "song_id": song_id,
        "status": "processing"
    }
