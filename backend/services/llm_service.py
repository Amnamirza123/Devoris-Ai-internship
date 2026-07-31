import os
import json
from openai import OpenAI

from schemas.extractor_schema import LeadInfo
from services.mongo_service import get_history, save_turn
from services.prompt_loader import chat_template, extractor_template
from services.token_logger import estimate_tokens, estimate_cost, log_usage
from services.retry_handler import run_with_retry

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

# NOTE: OpenRouter's free-model list changes over time.
# If this model stops working, check https://openrouter.ai/models?max_price=0
# for a currently-free model and update this line only.
MODEL = "inclusionai/ling-3.0-flash:free"
PRICE_PER_1K_TOKENS = 0.0


def generate_chat_stream(session_id: str, message: str, system_prompt: str | None):
    system = system_prompt or chat_template["system"]
    history = get_history(session_id)

    messages = [{"role": "system", "content": system}]
    for m in history:
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": message})

    input_tokens = sum(estimate_tokens(m["content"]) for m in messages)

    stream = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        stream=True,
    )

    full_reply = ""
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            full_reply += content
            yield content

    output_tokens = estimate_tokens(full_reply)
    cost = estimate_cost(input_tokens + output_tokens, PRICE_PER_1K_TOKENS)

    save_turn(session_id, message, full_reply)
    log_usage("chat", input_tokens, output_tokens, cost)

    yield f"\n\n---\n[tokens: {input_tokens} in / {output_tokens} out | est. cost: ${cost}]"


def extract_lead(text: str) -> dict:
    system_prompt = extractor_template["system"]

    def call_model(previous_error):
        user_content = extractor_template["user_template"].format(text=text)
        if previous_error:
            user_content += (
                f"\n\n(Previous response was invalid: {previous_error}. "
                "Return only valid JSON matching the schema.)"
            )
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            temperature=0,
        )
        return response.choices[0].message.content

    def parse_and_validate(raw):
        data = json.loads(raw)
        return LeadInfo(**data)

    outcome = run_with_retry(call_model, parse_and_validate)

    if outcome["success"]:
        tokens = estimate_tokens(system_prompt + text + outcome["raw"])
        cost = estimate_cost(tokens, PRICE_PER_1K_TOKENS)
        log_usage("extract", tokens, 0, cost)
        return {
            "result": outcome["result"],
            "attempt": outcome["attempt"],
            "est_tokens": tokens,
            "est_cost": cost,
        }
    return {"error": outcome["error"], "last_error": outcome["last_error"]}