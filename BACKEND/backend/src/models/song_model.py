from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class Song(BaseModel):
    id: Optional[str] = Field(default=None, alias='_id')
    title: str
    artist: Optional[str] = None
    duration: Optional[float] = None
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    file_path: str
    
    # Separate analysis sections with timestamps
    lyrics: Optional[Dict[str, Any]] = None  # {"text": "full lyrics", "segments": [{"start": 0.0, "end": 3.5, "text": "..."}]}
    chords: Optional[Dict[str, Any]] = None  # {"segments": [{"start": 0.0, "end": 4.0, "chord": "C", "confidence": 0.9}]}
    strumming: Optional[Dict[str, Any]] = None  # {"pattern": "D-DU-UDU", "bpm": 120, "segments": [{"start": 0.0, "end": 4.0, "pattern": "..."}]}
    
    processed: bool = False
    user_id: Optional[str] = None
