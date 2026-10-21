# Quadra Studio

## Run locally
1. `python -m venv venv` and activate it
2. `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and set `GROQ_API_KEY`
4. `uvicorn main:app --reload`
5. Open http://127.0.0.1:8000 (the backend also serves the website)

Health check: http://127.0.0.1:8000/api/health
