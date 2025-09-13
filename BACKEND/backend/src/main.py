import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.routes.user_routes import router as user_router

app = FastAPI()
app.include_router(user_router)

@app.get("/")
def root():
    return {"message": "Hello, world!"}
