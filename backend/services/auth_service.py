import os
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from services.mongo_service import users

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def register_user(username: str, email: str, password: str) -> dict:
    if users.find_one({"email": email}):
        return {"error": "Email already registered"}

    hashed = hash_password(password)
    result = users.insert_one({
        "username": username,
        "email": email,
        "password": hashed,
    })
    return {"id": str(result.inserted_id), "username": username, "email": email}


def login_user(email: str, password: str) -> dict:
    user = users.find_one({"email": email})
    if not user:
        return {"error": "User not found"}

    if not verify_password(password, user["password"]):
        return {"error": "Invalid password"}

    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"token": token}


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None