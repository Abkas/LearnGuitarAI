from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class SongUploadResponse(BaseModel):
    message: str
    song: Dict[str, Any]


class LyricsResponse(BaseModel):
    message: str
    song_id: str
    lyrics: Optional[Dict[str, Any]] = None
    chords: Optional[Dict[str, Any]] = None
    strumming: Optional[Dict[str, Any]] = None
    audio_url: Optional[str] = None
    status: Optional[str] = None


class AnalysisResponse(BaseModel):
    message: str
    song_id: str
    analysis: Optional[Dict[str, Any]] = None
    processed: Optional[bool] = None
