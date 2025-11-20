from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class SongUploadResponse(BaseModel):
    message: str
    song: Dict[str, Any]


class LyricsResponse(BaseModel):
    message: str
    song_id: str
    analysis: Optional[Dict[str, Any]] = None
    status: Optional[str] = None


class AnalysisResponse(BaseModel):
    message: str
    song_id: str
    analysis: Optional[Dict[str, Any]] = None
    processed: Optional[bool] = None
