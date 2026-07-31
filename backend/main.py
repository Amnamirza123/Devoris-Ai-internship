from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from schemas.extractor_schema import ChatRequest, ExtractRequest
from schemas.auth_schema import RegisterRequest, LoginRequest
from services.llm_service import generate_chat_stream, extract_lead
from services.mongo_service import get_history
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
        generate_chat_stream(request.session_id, request.message, request.system_prompt),
        media_type="text/plain",
    )


@app.get("/chat/{session_id}/history")
def chat_history(session_id: str, user: dict = Depends(get_current_user)):
    return get_history(session_id)


@app.post("/extract")
def extract(request: ExtractRequest, user: dict = Depends(get_current_user)):
    return extract_lead(request.text)