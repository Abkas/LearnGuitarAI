from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks
from ..middlewares.auth import get_current_user
from ..middlewares.lyrics_generator import generate_lyrics
from ..services import song_service
from ..schemas.song_schemas import SongUploadResponse, LyricsResponse, AnalysisResponse

router = APIRouter()


@router.post("/upload", response_model=SongUploadResponse)
async def upload_song(
    background_tasks: BackgroundTasks,
    current_email: str = Depends(get_current_user),
    file: UploadFile = File(...)
):
    return song_service.upload_song_file(file.file, file.filename, current_email, background_tasks)


@router.get("/lyrics/{song_id}")
async def get_lyrics(
    song_id: str,
    regenerate: bool = False,
    current_email: str = Depends(get_current_user)
):
    result = song_service.get_song_lyrics(song_id, current_email, regenerate)
    
    if result.get("status") == "processing" and "user_info" in result:
        await generate_lyrics(song_id, result["user_info"])
        result.pop("user_info", None)
    
    return result


@router.post("/lyrics_generator/{song_id}")
async def analyze_song(
    song_id: str,
    background_tasks: BackgroundTasks,
    current_email: str = Depends(get_current_user)
):
    return song_service.trigger_song_analysis(song_id, current_email, background_tasks)


@router.get("/songs/analysis/{song_id}", response_model=AnalysisResponse)
async def get_song_analysis(
    song_id: str,
    current_email: str = Depends(get_current_user)
):
    return song_service.get_song_analysis(song_id, current_email)
