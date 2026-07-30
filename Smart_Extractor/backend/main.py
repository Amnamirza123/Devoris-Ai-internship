from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from schemas.extractor_schema import ChatRequest, ExtractRequest
from services.llm_service import generate_chat_stream, extract_lead
from services.mongo_service import get_history

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat(request: ChatRequest):
    return StreamingResponse(
        generate_chat_stream(
            request.session_id,
            request.message,
            request.system_prompt
        ),
        media_type="text/event-stream",
    )


@app.get("/chat/{session_id}/history")
def chat_history(session_id: str):
    return get_history(session_id)


@app.post("/extract")
def extract(request: ExtractRequest):
    return extract_lead(request.text)