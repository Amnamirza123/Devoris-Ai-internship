import os
from pymongo import MongoClient
from zoneinfo import ZoneInfo
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

def set_chat_title(session_id: str, user_id: str, title: str) -> bool:
    result = chats.update_one(
        {"session_id": session_id, "user_id": user_id},
        {"$set": {"custom_title": title}}
    )
    return result.matched_count > 0


def list_user_sessions(user_id: str) -> list[dict]:
    cursor = chats.find(
        {"user_id": user_id},
        {"session_id": 1, "messages": {"$slice": 1}, "custom_title": 1}
    ).sort("_id", -1)

    raw = []
    for doc in cursor:
        first_message = ""
        if doc.get("messages"):
            first_message = doc["messages"][0]["content"]
        auto_title = first_message[:50] + "..." if len(first_message) > 50 else first_message
        auto_title = auto_title or "New conversation"
        custom_title = doc.get("custom_title")
        title = custom_title or auto_title
        timestamp = doc["_id"].generation_time
        raw.append({
            "session_id": doc["session_id"],
            "title": title,
            "timestamp": timestamp,
            "has_custom_title": bool(custom_title),
        })

    by_title = {}
    for item in raw:
        by_title.setdefault(item["title"], []).append(item)

    result_by_id = {}
    for title, items in by_title.items():
        if len(items) == 1 or items[0]["has_custom_title"]:
            for item in items:
                result_by_id[item["session_id"]] = item["title"]
        else:
            for item in items:
                if item["has_custom_title"]:
                    result_by_id[item["session_id"]] = item["title"]
                else:
                    local_time = item["timestamp"].astimezone(ZoneInfo("Asia/Lahore"))
                    time_label = local_time.strftime("%b %d, %I:%M %p")
                    result_by_id[item["session_id"]] = f"{title} ({time_label})"

    return [
        {"session_id": item["session_id"], "title": result_by_id[item["session_id"]]}
        for item in raw
    ]