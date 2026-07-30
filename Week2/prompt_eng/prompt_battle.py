import json
import os
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


with open("test.json") as f:
    test = json.load(f)



prompt_A = """
Extract contact information from the text.
Return JSON.
"""


prompt_B = """
You are an information extraction expert.

Extract:
name
email
phone

Return ONLY valid JSON.

Format:

{
"name":"",
"email":"",
"phone":""
}

Use null for missing values.
"""



def run_prompt(prompt, text):

    response = client.chat.completions.create(
        model="inclusionai/ling-3.0-flash:free",
        temperature=0,
        messages=[
            {
                "role":"system",
                "content":prompt
            },
            {
                "role":"user",
                "content":text
            }
        ]
    )

    return response.choices[0].message.content



def evaluate(prompt):

    correct = 0

    for case in test:

        output = run_prompt(
            prompt,
            case["text"]
        )

        print("\nOutput:")
        print(output)

        if case["expected"]["email"] in output:
            correct += 1


    accuracy = correct / len(test) * 100

    return accuracy



print(
"Prompt A Accuracy:",
evaluate(prompt_A)
)


print(
"Prompt B Accuracy:",
evaluate(prompt_B)
)