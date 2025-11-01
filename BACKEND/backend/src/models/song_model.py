from pydantic import BaseModel, Field, GetJsonSchemaHandler
from typing import Optional, List, Dict, Any, Annotated
from datetime import datetime
from bson import ObjectId
import json
from pydantic.json_schema import JsonSchemaValue

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: Any
    ) -> Any:
        return {
            "type": "string",
            "deserialize": lambda x: ObjectId(x) if ObjectId.is_valid(x) else x,
            "serialize": lambda x: str(x)
        }

class SongBase(BaseModel):
    title: str = Field(...)
    artist: Optional[str] = None
    duration: Optional[float] = None  
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    file_path: str = Field(...)  

class ChordAnalysis(BaseModel):
    timestamp: float  
    chord: str       
    confidence: Optional[float] = None  

class Lyrics(BaseModel):
    start_time: float  
    end_time: float    
    text: str         

class AIAnalysis(BaseModel):
    chords: Optional[List[ChordAnalysis]] = []
    lyrics: Optional[List[Lyrics]] = []
    # key: Optional[str] = None      # Musical key

class Song(SongBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    analysis: Optional[AIAnalysis] = None
    processed: bool = False  # Indicates if AI analysis is complete
    user_id: Optional[PyObjectId] = None  # Reference to the user who uploaded the song

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
