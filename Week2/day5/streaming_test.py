import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

stream = client.chat.completions.create( # this is api setting
    model="inclusionai/ling-3.0-flash:free",
    messages=[{"role": "user", "content": "Explain what a Fast API is."}],
    stream=True, # using this to stream response
)

for chunk in stream: #looping throught the response untll it gets end and with evey loop run it given a chunk back
    content = chunk.choices[0].delta.content #for streaimg we use delta instaed of message 
    if content:
        print(content, end="", flush=True)