import os
import json
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_PATH = os.path.join(BASE_DIR, "logs", "usage.json")


def estimate_tokens(text: str) -> int:
    return max(1, len(text) // 4)


def estimate_cost(tokens: int, price_per_1k: float = 0.0) -> float:
    return round((tokens / 1000) * price_per_1k, 6)


def log_usage(endpoint: str, input_tokens: int, output_tokens: int, cost: float) -> None:
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)

    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "endpoint": endpoint,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens,
        "est_cost": cost,
    }

    existing = []
    if os.path.exists(LOG_PATH):
        with open(LOG_PATH, "r") as f:
            try:
                loaded = json.load(f)
                if isinstance(loaded, list):
                    existing = loaded
            except json.JSONDecodeError:
                pass

    existing.append(entry)

    with open(LOG_PATH, "w") as f:
        json.dump(existing, f, indent=2)