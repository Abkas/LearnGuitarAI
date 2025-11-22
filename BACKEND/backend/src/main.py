
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.routes.user_routes import router as user_router
from src.routes.song_route import router as song_router
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="d:/GUITARIFY/BACKEND/backend/.env")


app = FastAPI()

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://127.0.0.1:5173").strip()
# Use BACKEND_ALLOWED_ORIGINS env variable for CORS (comma-separated)
allowed_origins = os.environ.get("BACKEND_ALLOWED_ORIGINS", "http://127.0.0.1:5173")
origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(user_router)
app.include_router(song_router, prefix="/songs")

@app.get("/")
def root():
    return {"message": "Hello, world!"}
