from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="d:/GUITARIFY/BACKEND/backend/src/.env")

uri = os.getenv("MONGODB_URI")

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("✅ Connected to MongoDB!")
except Exception as e:
    print("❌ Could not connect to MongoDB:", e)


def get_users_collection():
    db = client["users"]  
    return db["users"]
