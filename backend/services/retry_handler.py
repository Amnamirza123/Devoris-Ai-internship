import json
from pydantic import ValidationError


def run_with_retry(call_model, parse_and_validate, max_retries: int = 3) -> dict:
    """
    Retries up to max_retries times on either:
    - the model returning invalid/unparseable JSON (json.JSONDecodeError,
      ValidationError from Pydantic), or
    - the model call itself failing (RuntimeError, e.g. a rate limit or
      network issue raised by the caller's call_model function).

    Both failure types share the same retry budget and the same
    last_error tracking, so call_model can see the previous failure
    reason (JSON error or API error) and adjust its next attempt.
    """
    last_error = None

    for attempt in range(max_retries):
        try:
            raw = call_model(last_error)
        except RuntimeError as e:
            last_error = str(e)
            continue

        try:
            result = parse_and_validate(raw)
            return {"success": True, "result": result, "attempt": attempt + 1, "raw": raw}
        except (json.JSONDecodeError, ValidationError) as e:
            last_error = str(e)

    return {"success": False, "error": "Failed to get valid JSON after retries", "last_error": last_error}