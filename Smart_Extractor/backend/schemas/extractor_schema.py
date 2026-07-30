from pydantic import BaseModel


class ChatRequest(BaseModel):
    session_id: str
    message: str
    system_prompt: str | None = None


class LeadInfo(BaseModel):
    name: str | None
    email: str | None
    phone: str | None
    company: str | None


class ExtractRequest(BaseModel):
    text: str