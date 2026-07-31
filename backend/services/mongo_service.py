import os
from pymongo import MongoClient

mongo = MongoClient(os.getenv("MONGO_URI"))
db = mongo["smart_extractor"]
chats = db["chat_history"]
users = db["users"]


def get_history(session_id: str, user_id: str | None = None) -> list[dict]:
    query = {"session_id": session_id}
    if user_id:
        query["user_id"] = user_id
    doc = chats.find_one(query)
    if doc and "messages" in doc:
        return doc["messages"]
    return []


def save_turn(session_id: str, user_id: str, user_message: str, assistant_message: str) -> None:
    chats.update_one(
        {"session_id": session_id},
        {
            "$push": {"messages": {"$each": [
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": assistant_message},
            ]}},
            "$setOnInsert": {"user_id": user_id},
        },
        upsert=True,
    )


def list_user_sessions(user_id: str) -> list[dict]:
    cursor = chats.find(
        {"user_id": user_id},
        {"session_id": 1, "messages": {"$slice": 1}}
    ).sort("_id", -1)

    sessions = []
    for doc in cursor:
        first_message = ""
        if doc.get("messages"):
            first_message = doc["messages"][0]["content"]
        title = first_message[:50] + "..." if len(first_message) > 50 else first_message
        sessions.append({"session_id": doc["session_id"], "title": title or "New conversation"})
    return sessions