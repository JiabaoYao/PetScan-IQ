<!-- Copilot / AI Agent instructions tailored for this repo -->
# PetScan-IQ — Copilot Instructions

Purpose: quickly orient an AI coding agent to the repository layout, runtime flows, common conventions, and implementation details that are necessary to be productive immediately.

- Big picture
  - Two primary components: a static/frontend client and a Python backend.
  - Frontend lives under `client/` (key files: `client/src/App.js`, `client/src/components/chatbot.js`). It's a minimal React-style UI that POSTs user messages to the backend.
  - Backend lives under `server/app/` and is a FastAPI app (entry: `server/app/main.py`). API route handlers are in `server/app/api/` and AI logic in `server/app/services/`.
  - Orchestration: `docker-compose.yml` exists to run both services together; each service also has a `Dockerfile`.

- Important entry points and examples to inspect first
  - Backend: `server/app/main.py` (FastAPI app bootstrap)
  - Routes: `server/app/api/chat_routes.py` (defines chat endpoints and uses service layer)
  - Services: `server/app/services/gemini_service.py` (integration with generative AI) and `server/app/services/ai.service.py` (present but empty — check intended usage)
  - Models: `server/app/models/chat_models.py` (Pydantic request/response shapes)
  - Frontend: `client/src/App.js` and `client/src/components/chatbot.js` (example fetch POST and simple UI update)

- Notable discovered facts / gotchas (verify before editing production code)
  - Port mismatch: frontend mock code posts to `http://127.0.0.1:9000/`, while server default runs on port `8000`. Confirm which port is intended and update client or server accordingly.
  - `chat_routes.py` defines an `APIRouter` but the minimal `main.py` we saw does not include the router via `app.include_router(...)`. Confirm router registration before assuming endpoints are mounted.
  - `server/app/services/ai.service.py` is currently empty — the project relies on `gemini_service.py` for AI logic. Check tests or usage to decide whether to consolidate.

- How to run locally (quick commands)
  - Backend (venv approach):
    - Create/activate venv, then install: `pip install -r server/requirements.txt`.
    - Run: `python -m app.main` or `uvicorn app.main:app --reload --port 8000`.
  - Frontend: there is no `package.json` in the repo snapshot. The client is a static React-like folder; use its Dockerfile or a static server to serve `client/` assets. For full integrated runs, use:
    - `docker-compose up --build` (preferred for reproducing environment)

- API and data flow conventions
  - Requests/responses use Pydantic models in `server/app/models/` — prefer adding/validating shapes there.
  - AI calls are implemented in `server/app/services/` and generally expose async methods (await usage). Follow async patterns when calling into services.
  - External AI integration uses `google-generativeai` (see `server/requirements.txt`) — environmental secrets (API keys) are expected to be supplied via environment variables or an `.env` file; search for `os.getenv` or `python-dotenv` usage when adding new integrations.

- Editing and testing guidance
  - When changing API shapes, update the Pydantic models in `server/app/models/` and update route `response_model` declarations.
  - If you add endpoints, register routers in `server/app/main.py` using `app.include_router(<router>, prefix="/api")` and re-run `uvicorn`.
  - When editing frontend fetch calls (in `client/src/components/chatbot.js`), ensure the fetch URL and server port match and that requests send JSON body and `Content-Type` if needed.
  - Use `docker-compose` to reproduce the multi-service environment; otherwise run backend with `uvicorn` and serve frontend assets locally.

- Conventions for patches & PRs targeting this repo
  - Small, focused PRs are preferred: change one service or UI area at a time (e.g., fix routing, then update client URL).
  - Include a short manual testing note in PR describing exact commands used to run backend and frontend locally and the endpoint to test (example: `POST /chat` with payload matching `ChatRequest`).

- Quick TODOs an agent can pick up immediately
  - Confirm and align ports between client and server (client: `client/src/components/chatbot.js`, server: `server/app/main.py`).
  - Register `chat_routes` router in `main.py` if missing.
  - Implement or remove `server/app/services/ai.service.py` depending on design choice — consolidate AI logic into a single service class.

If anything here is unclear or you want additional examples (e.g., exact router registration snippet or a local dev docker-compose run sample), tell me which part to expand and I'll update this file.
