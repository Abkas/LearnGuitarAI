from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from ..core.database import get_songs_collection, get_users_collection
from ..middlewares.auth import get_current_user
from ..middlewares.lyrics_generator import generate_lyrics
from ..models.song_model import Song
import os
import shutil
from datetime import datetime
from bson import ObjectId

router = APIRouter()

# Use an absolute uploads directory inside the backend package so file writes
# don't depend on the current working directory used to start uvicorn.
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_song(
    background_tasks: BackgroundTasks,
    current_email: str = Depends(get_current_user),
    file: UploadFile = File(...)
):
    title = os.path.splitext(file.filename)[0]
    
    # Save the file locally
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Resolve the user document from the email returned by get_current_user
    users_collection = get_users_collection()
    db_user = users_collection.find_one({"email": current_email})
    if not db_user:
        # If no user found for the token's email, remove uploaded file and abort
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=404, detail="User not found")

    # Ensure user id is a string so other helpers can build ObjectId(...) from it
    user_info = db_user
    user_info["_id"] = str(user_info["_id"])

    song = Song(
        title=title,
        file_path=file_path,
        # Ensure we pass a plain string here (PyObjectId expects str input)
        user_id=str(db_user["_id"]),
        processed=False,  # Initially not processed by AI
        analysis=None    # No AI analysis yet
    )
    
    try:
        songs_collection = get_songs_collection()
        result = songs_collection.insert_one(song.dict(by_alias=True))
        song.id = str(result.inserted_id)

        # Start lyrics generation in the background. Pass user_info (with _id as str)
        background_tasks.add_task(generate_lyrics, str(result.inserted_id), user_info)

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
    current_email: str = Depends(get_current_user)
):
    """
    Get lyrics for a song. Can optionally force regeneration of lyrics.
    """
    # Resolve user from email
    users_collection = get_users_collection()
    db_user = users_collection.find_one({"email": current_email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_info = db_user
    user_info["_id"] = str(user_info["_id"])

    songs_collection = get_songs_collection()
    song = songs_collection.find_one({
        "_id": ObjectId(song_id),
        "user_id": ObjectId(user_info["_id"])
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
    await generate_lyrics(song_id, user_info)

    return {
        "message": "Lyrics generation started",
        "song_id": song_id,
        "status": "processing"
    }
