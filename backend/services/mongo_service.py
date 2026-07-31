import os
from pymongo import MongoClient

mongo = MongoClient(os.getenv("MONGO_URI"))
db = mongo["smart_extractor"]
chats = db["chat_history"]
users = db["users"]


def get_history(session_id: str) -> list[dict]:
    doc = chats.find_one({"session_id": session_id})
    if doc and "messages" in doc:
        return doc["messages"]
    return []


def save_turn(session_id: str, user_message: str, assistant_message: str) -> None:
    chats.update_one(
        {"session_id": session_id},
        {"$push": {"messages": {"$each": [
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": assistant_message},
        ]}}},
        upsert=True,
    )