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


MODEL = "inclusionai/ling-3.0-flash:free"
PRICE_PER_1K_TOKENS = 0.0


def generate_chat_stream(session_id: str, message: str, system_prompt: str | None):

    print("STEP 1: function started")

    system = system_prompt or chat_template["system"]
    print("STEP 2: system prompt loaded:", system)

    history = get_history(session_id)
    print("STEP 3: history loaded:", history)

    messages = [
        {
            "role": "system",
            "content": system
        }
    ]

    for m in history:
        messages.append(
            {
                "role": m["role"],
                "content": m["content"]
            }
        )

    messages.append(
        {
            "role": "user",
            "content": message
        }
    )

    print("STEP 4: messages built:", messages)


    input_tokens = sum(
        estimate_tokens(m["content"])
        for m in messages
    )

    print("STEP 5: input tokens:", input_tokens)


    print("STEP 6: calling model...")


    stream = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        stream=True,
        max_tokens=1024,
        extra_body={
            "reasoning": {
                "exclude": True
            }
        }
    )


    print("STEP 7: stream object created")


    full_reply = ""

    chunk_count = 0
    MAX_CHUNKS = 500


    for chunk in stream:

        chunk_count += 1

        if chunk_count > MAX_CHUNKS:
            print("Stream stopped: chunk limit reached")
            break


        print("STEP 8: got a chunk")


        delta = chunk.choices[0].delta


        # Normal answer tokens
        content = getattr(
            delta,
            "content",
            None
        )


        # Reasoning tokens (if model sends them)
        reasoning = (
            getattr(delta, "reasoning", None)
            or getattr(delta, "reasoning_content", None)
        )


        if reasoning:
            print(
                "Reasoning chunk received:",
                reasoning
            )


        if content:

            full_reply += content

            yield content



    print(
        "STEP 9: stream finished, full reply:",
        full_reply
    )


    output_tokens = estimate_tokens(full_reply)


    cost = estimate_cost(
        input_tokens + output_tokens,
        PRICE_PER_1K_TOKENS
    )


    save_turn(
        session_id,
        message,
        full_reply
    )

    print("STEP 10: saved to mongo")


    log_usage(
        "chat",
        input_tokens,
        output_tokens,
        cost
    )


    print("STEP 11: logged usage")


    yield (
        f"\n\n---\n"
        f"[tokens: {input_tokens} in / "
        f"{output_tokens} out | "
        f"est. cost: ${cost}]"
    )



def extract_lead(text: str):

    system_prompt = extractor_template["system"]


    def call_model(previous_error):

        user_content = extractor_template["user_template"].format(
            text=text
        )


        if previous_error:

            user_content += (
                f"\n\n(Previous response was invalid: "
                f"{previous_error}. "
                "Return only valid JSON matching the schema.)"
            )


        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_content
                },
            ],
            temperature=0,
        )


        return response.choices[0].message.content



    def parse_and_validate(raw):

        data = json.loads(raw)

        return LeadInfo(**data)



    outcome = run_with_retry(
        call_model,
        parse_and_validate
    )


    if outcome["success"]:

        tokens = estimate_tokens(
            system_prompt +
            text +
            outcome["raw"]
        )


        cost = estimate_cost(
            tokens,
            PRICE_PER_1K_TOKENS
        )


        log_usage(
            "extract",
            tokens,
            0,
            cost
        )


        return {
            "result": outcome["result"],
            "attempt": outcome["attempt"],
            "est_tokens": tokens,
            "est_cost": cost,
        }


    else:

        return {
            "error": outcome["error"],
            "last_error": outcome["last_error"]
        }