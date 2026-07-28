import os # lets us interact with our own s, here this is used to read .env
import yaml # loads the pyyaml installed package  , giving the ability to read .yaml files and convert them into Python data structures.
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"), #gets api from env file where we secured the API key and not hardcoded it here
    base_url="https://openrouter.ai/api/v1",
)

with open("templates.yaml") as f: # opening template library, with : used to automatically ope and close the file
    templates = yaml.safe_load(f) #reads the yaml file and converts the human language of file to python data structures

def run_template(template_name, **kwargs): #kwarge can get any extra named information
    template = templates[template_name]
    user_message = template["user_template"].format(**kwargs)

    response = client.chat.completions.create(
        model="inclusionai/ling-3.0-flash:free",
        messages=[
            {"role": "system", "content": template["system"]},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content

result = run_template("summarize", text="Our Q3 sales grew by 12% compared to Q2, driven mainly by the new product line launched in July. However, customer support response times increased significantly.")
print(result)