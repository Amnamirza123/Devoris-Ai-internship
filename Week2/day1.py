import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

response = client.chat.completions.create(
    model="inclusionai/ling-3.0-flash:free",
    messages=[
        {"role": "user", "content": "Explain what a REST API is in one sentence."}
    ]
)

print(response.choices[0].message.content)