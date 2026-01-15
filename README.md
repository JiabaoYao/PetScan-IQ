# PetScan-IQ
Pet image classification and intelligence
```
pawguide-ai/
├── backend/                 # Backend Service (FastAPI)
│   ├── app/
│   │   ├── api/             # Route handlers
│   │   │   └── v1/
│   │   │       ├── chat.py
│   │   │       └── pets.py
│   │   ├── core/            # Config, security, constants
│   │   │   └── config.py
│   │   ├── models/          # Data models (Pydantic, SQLAlchemy)
│   │   │   └── pet.py
│   │   ├── services/        # Business logic & AI Engine
│   │   │   ├── ai_service.py (Formerly engine.py)
│   │   │   └── pet_service.py
│   │   ├── db/              # Database connections
│   │   │   └── chroma_client.py
│   │   └── main.py          # Entry point
│   ├── data/                # Knowledge base for RAG
│   │   └── care_guides/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                # Client Side (React/Next.js/Tailwind)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/           # API calling logic
│   │   └── App.js
│   ├── public/
│   └── Dockerfile
│
└── docker-compose.yml       # Orchestrates both services
```

# Debug & Test
1. Acitvate virtual env
```
source .server_venv/bin/activate
```

2. Install dependencies
```
pip3 install fastapi uvicorn google-generativeai python-dotenv
```

3. Start the server
```
python -m app.main
or
uvicorn app.main:app --reload --port 8000
```

4. Test it: Open your browser to http://127.0.0.1:8000/docs.
You will see the interactive Swagger UI where you can test your /api/v1/chat endpoint.

5. Full Stack Testing
* Back-end: uvicorn app.main:app --reload --port 8000
* Front-end:
```
npm create vite@latest . 
npm run dev
```
* Check API Key Validation
```
curl 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=GEMINI_API_KEY' \
    -H 'Content-Type: application/json' \
    -X POST \
    -d '{ "contents": [{ "parts":[{"text": "Hi"}]}]}'
```
