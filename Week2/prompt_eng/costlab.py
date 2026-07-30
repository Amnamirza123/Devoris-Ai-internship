import os
import tiktoken
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


encoder = tiktoken.get_encoding("cl100k_base") #loads open ai tokenizer 


prompt = """
Extract the person's name, email and phone number.
Return only valid JSON.

Text:
John Smith can be contacted at john@gmail.com
"""


# Estimate tokens before request
estimated_tokens = len(
    encoder.encode(prompt)
)

print("Estimated input tokens:", estimated_tokens)


total_tokens = 0


for i in range(20):

    response = client.chat.completions.create(
        model="inclusionai/ling-3.0-flash:free",
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )


    usage = response.usage

    total_tokens += usage.total_tokens

    print(
        f"Request {i+1}: {usage.total_tokens} tokens"
    )


print("-------------------------")
print("Estimated cost tokens:", estimated_tokens * 20)
print("Actual tokens used:", total_tokens)