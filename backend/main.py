from dotenv import load_dotenv
load_dotenv()

from services.mongo_service import get_history, list_user_sessions

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from schemas.extractor_schema import ChatRequest, ExtractRequest, RenameSessionRequest
from schemas.auth_schema import RegisterRequest, LoginRequest
from services.llm_service import generate_chat_stream, extract_lead
from services.mongo_service import get_history, set_chat_title, delete_chat_session
from services.auth_service import register_user, login_user
from services.auth_dependency import get_current_user

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/register")
def register(request: RegisterRequest):
    return register_user(request.username, request.email, request.password)


@app.post("/login")
def login(request: LoginRequest):
    return login_user(request.email, request.password)


@app.post("/chat")
def chat(request: ChatRequest, user: dict = Depends(get_current_user)):
    return StreamingResponse(
        generate_chat_stream(request.session_id, user["user_id"], request.message, request.system_prompt),
        media_type="text/plain",
    )
@app.patch("/chat/{session_id}/rename")
def rename_session(session_id: str, request: RenameSessionRequest, user: dict = Depends(get_current_user)):
    title = request.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    success = set_chat_title(session_id, user["user_id"], title)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "title": title}


@app.get("/chat/sessions")
def chat_sessions(user: dict = Depends(get_current_user)):
    return list_user_sessions(user["user_id"])


@app.get("/chat/{session_id}/history")
def chat_history(session_id: str, user: dict = Depends(get_current_user)):
    return get_history(session_id, user["user_id"])

@app.delete("/chat/{session_id}")
def delete_session(session_id: str, user: dict = Depends(get_current_user)):
    success = delete_chat_session(session_id, user["user_id"])
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "deleted": True}


@app.post("/extract")
def extract(request: ExtractRequest, user: dict = Depends(get_current_user)):
    return extract_lead(request.text)