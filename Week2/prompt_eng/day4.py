import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, ValidationError

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

class ContactInfo(BaseModel):
    name: str | None
    email: str | None
    phone: str | None

def extract_contact(text, max_retries=3):
    for attempt in range(max_retries):
        response = client.chat.completions.create(
            model="inclusionai/ling-3.0-flash:free",
            messages=[
                {"role": "system", "content": 'Extract name, email, and phone from the text. Return ONLY valid JSON in this exact format: {"name": ..., "email": ..., "phone": ...}. Use null for missing fields.'},
                {"role": "user", "content": text}
            ],
            temperature=0,
        )
        raw_json = response.choices[0].message.content

        try:
            data = json.loads(raw_json)
            contact = ContactInfo(**data)
            return contact
        except (json.JSONDecodeError, ValidationError) as e:
            print(f"Attempt {attempt + 1} failed: {e}")

    raise Exception("Failed to get valid JSON after retries")

result = extract_contact("You can reach out to Jane, but no contact details were given.")
print(result)