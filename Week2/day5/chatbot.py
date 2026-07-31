import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

class ChatRequest(BaseModel): # this is a schema json response must follow it will get validate by pydantric
    message: str
    system_prompt: str = "You are a helpful assistant."

class ContactInfo(BaseModel):
    name: str | None
    email: str | None
    phone: str | None

class ExtractRequest(BaseModel):
    text: str


def generate_stream(message: str, system_prompt: str):
    stream = client.chat.completions.create(
        model="inclusionai/ling-3.0-flash:free",
        messages=[
            {"role": "system", "content":system_prompt},
            {"role": "user", "content": message}
        ],
        stream=True,
    )
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content


@app.post("/chat")
def chat(request: ChatRequest):
    return StreamingResponse(
        generate_stream(request.message, request.system_prompt),
        media_type="text/plain"
    )


@app.post("/extract")
def extract(request: ExtractRequest):
    response = client.chat.completions.create(
        model="inclusionai/ling-3.0-flash:free",
        messages=[
            {"role": "system", "content": 'You are a senior dtaa nalst and are assigned to Extract name, email, and phone from the text. Return ONLY valid JSON: {"name": ..., "email": ..., "phone": ...}. Use null for missing fields.'},
            {"role": "user", "content": request.text}
        ],
        temperature=0,
    )
    raw_json = response.choices[0].message.content
    data = json.loads(raw_json)
    return ContactInfo(**data)