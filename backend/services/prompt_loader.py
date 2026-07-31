import os
import yaml

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_prompt(filename: str) -> dict:
    path = os.path.join(BASE_DIR, "prompts", filename)
    with open(path) as f:
        return yaml.safe_load(f)


chat_template = load_prompt("chat.yaml")
extractor_template = load_prompt("extractor.yaml")