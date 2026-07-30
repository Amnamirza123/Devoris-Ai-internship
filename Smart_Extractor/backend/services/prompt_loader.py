import yaml


def load_prompt(filename: str) -> dict:
    with open(f"prompts/{filename}") as f:
        return yaml.safe_load(f)


chat_template = load_prompt("chat.yaml")
extractor_template = load_prompt("extractor.yaml")