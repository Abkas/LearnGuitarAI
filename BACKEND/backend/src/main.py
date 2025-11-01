import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.routes.user_routes import router as user_router
from src.routes.song_route import router as song_router

app = FastAPI()

origins = [
    "http://localhost:5173",      
    "http://127.0.0.1:5173",     
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(user_router)
app.include_router(song_router, prefix="/songs")  
@app.get("/")
def root():
    return {"message": "Hello, world!"}
