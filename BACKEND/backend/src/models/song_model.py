from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class Song(BaseModel):
    id: Optional[str] = Field(default=None, alias='_id')
    title: str
    artist: Optional[str] = None
    duration: Optional[float] = None
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    file_path: str
    analysis: Optional[Dict[str, Any]] = None
    processed: bool = False
    user_id: Optional[str] = None
