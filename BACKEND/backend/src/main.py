
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.routes.user_routes import router as user_router
from src.routes.song_route import router as song_router
import os
from dotenv import load_dotenv

load_dotenv()



app = FastAPI()

origins = [o.strip() for o in os.getenv("BACKEND_ALLOWED_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
print("Allowed CORS origins:", origins)

# Debug middleware to print incoming request Origin header
from starlette.middleware.base import BaseHTTPMiddleware
class DebugOriginMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        origin = request.headers.get("origin")
        print(f"Incoming request Origin: {origin}")
        response = await call_next(request)
        return response

app.add_middleware(DebugOriginMiddleware)

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
