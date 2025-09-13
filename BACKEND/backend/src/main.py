import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.routes.user_routes import router as user_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(user_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],        # URLs that can talk to backend
    allow_credentials=True,       # Allow cookies/headers like Authorization
    allow_methods=["*"],          # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],          # Allow all headers (Authorization, Content-Type, etc.)
)

@app.get("/")
def root():
    return {"message": "Hello, world!"}
