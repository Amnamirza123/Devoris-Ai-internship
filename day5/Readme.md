# Day 5 — Python & FastAPI

Python refresher and a minimal FastAPI service, built as a side-by-side comparison to the Express backend from Day 2/3.

## What's in this folder

- `main.py` — Minimal FastAPI service for a `tasks` resource (GET, POST), using Pydantic for automatic request validation

## Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload
```
Runs on `http://127.0.0.1:8000`.

## Routes

| Method | Route | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks (in-memory list) |
| POST | `/tasks` | Create a new task (validated against the `Task` Pydantic model) |

## Interactive API Docs

FastAPI automatically generates interactive documentation, available at:

http://127.0.0.1:8000/docs


Every route, request body, and response shape is documented and testable directly from this page — no separate tool (like Swagger/Postman) required to set this up manually.

## Express vs FastAPI — Comparison

**Validation:** Express requires manually validating request data and wrapping routes in try/catch to handle bad input. FastAPI validates automatically using Pydantic models — invalid data is rejected with a clear error before the route code even runs.

**Documentation:** FastAPI generates interactive docs automatically (`/docs`). Express has no built-in equivalent — achieving the same requires manually setting up a separate tool like Swagger.

**Language ecosystem:** Express keeps the whole stack in JavaScript, which matters when working alongside a JavaScript frontend (like this project's React app). FastAPI fits naturally when working in Python-heavy ecosystems, especially AI/ML, where most tooling (PyTorch, pandas, scikit-learn) is Python-first.

**When to choose each:** Express for JavaScript-based full-stack projects needing flexibility and a large middleware ecosystem. FastAPI for Python-based projects, especially where strong automatic validation and self-documenting APIs matter — common in data-heavy or AI-adjacent services.

## Author

Amna mirza| AI Intern, DevOrbis
