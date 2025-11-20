from fastapi import HTTPException, BackgroundTasks
from typing import Dict, Any
from bson import ObjectId
import os
import shutil
from ..core.database import get_songs_collection, get_users_collection
from ..middlewares.lyrics_generator import generate_lyrics
from ..models.song_model import Song


# Upload directory configuration
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def upload_song_file(
    file_content,
    filename: str,
    current_email: str,
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    title = os.path.splitext(filename)[0]
    
    # Save the file locally
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file_content, buffer)
    
    # Resolve the user document from the email
    users_collection = get_users_collection()
    db_user = users_collection.find_one({"email": current_email})
    if not db_user:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=404, detail="User not found")

    user_info = db_user
    user_info["_id"] = str(user_info["_id"])

    song = Song(
        title=title,
        file_path=file_path,
        user_id=str(db_user["_id"]),
        processed=False,
        analysis=None
    )
    
    try:
        songs_collection = get_songs_collection()
        # Insert without _id field, let MongoDB generate it
        song_dict = song.dict(by_alias=True, exclude={"id"})
        result = songs_collection.insert_one(song_dict)

        # Read back and convert all fields to proper types
        saved = songs_collection.find_one({"_id": result.inserted_id})
        if saved:
            saved["_id"] = str(saved["_id"])
            if saved.get("user_id"):
                saved["user_id"] = str(saved["user_id"])
            if saved.get("upload_date"):
                try:
                    saved["upload_date"] = saved["upload_date"].isoformat()
                except Exception:
                    pass
        else:
            saved = {
                "_id": str(result.inserted_id),
                "title": title,
                "file_path": file_path,
                "processed": False,
                "analysis": None,
                "user_id": str(db_user["_id"])
            }

        # Start lyrics generation in the background
        background_tasks.add_task(generate_lyrics, str(result.inserted_id), user_info)

        return {"message": "Song uploaded successfully. Lyrics generation started.", "song": saved}
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to save song metadata: {str(e)}")


def get_song_lyrics(song_id: str, current_email: str, regenerate: bool = False) -> Dict[str, Any]:
    users_collection = get_users_collection()
    db_user = users_collection.find_one({"email": current_email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_info = db_user
    user_info["_id"] = str(user_info["_id"])

    songs_collection = get_songs_collection()
    song = songs_collection.find_one({
        "_id": ObjectId(song_id),
        "user_id": user_info["_id"]
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
    # Note: This is synchronous; for async routes, caller should await
    return {
        "message": "Lyrics generation started",
        "song_id": song_id,
        "status": "processing",
        "user_info": user_info
    }


def trigger_song_analysis(
    song_id: str,
    current_email: str,
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    """Trigger lyrics/analysis generation for an existing song"""
    users_collection = get_users_collection()
    db_user = users_collection.find_one({"email": current_email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_info = db_user
    user_info["_id"] = str(user_info["_id"])

    songs_collection = get_songs_collection()
    song = songs_collection.find_one({
        "_id": ObjectId(song_id),
        "user_id": user_info["_id"]
    })

    if not song:
        raise HTTPException(status_code=404, detail="Song not found or not owned by user")

    # Schedule background processing
    background_tasks.add_task(generate_lyrics, song_id, user_info)

    return {"message": "Analysis started", "song_id": song_id, "status": "processing"}


def get_song_analysis(song_id: str, current_email: str) -> Dict[str, Any]:
    """Return the analysis object for a song (lyrics + segments + error if any)"""
    users_collection = get_users_collection()
    db_user = users_collection.find_one({"email": current_email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_info = db_user
    user_info["_id"] = str(user_info["_id"])

    songs_collection = get_songs_collection()
    song = songs_collection.find_one({
        "_id": ObjectId(song_id),
        "user_id": user_info["_id"]
    })

    if not song:
        raise HTTPException(status_code=404, detail="Song not found or not owned by user")

    analysis = song.get("analysis")
    if not analysis:
        return {"message": "No analysis available yet", "song_id": song_id, "processed": song.get("processed", False)}

    return {"message": "Analysis retrieved", "song_id": song_id, "analysis": analysis}
