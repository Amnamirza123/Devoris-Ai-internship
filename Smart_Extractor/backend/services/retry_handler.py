import json
from pydantic import ValidationError


def run_with_retry(call_model, parse_and_validate, max_retries: int = 3):
    """
    call_model(previous_error: str | None) -> raw text response from the model
    parse_and_validate(raw: str) -> validated Pydantic object
    """
    last_error = None

    for attempt in range(max_retries):
        raw = call_model(last_error)
        try:
            result = parse_and_validate(raw)
            return {"success": True, "result": result, "attempt": attempt + 1, "raw": raw}
        except (json.JSONDecodeError, ValidationError) as e:
            last_error = str(e)

    return {"success": False, "error": "Failed to get valid JSON after retries", "last_error": last_error}