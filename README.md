<p align="center">
  <img src="assets/banner.svg" alt="Quadra Studio" width="100%" />
</p>

<h1 align="center">Quadra Studio</h1>

<p align="center">
  Portfolio website for Quadra Studio with an AI-powered technical interview bot.
</p>

---

## Features

- Multi-page website: Home, Projects, Pricing, Payment, Help and Join Us
- Dark / light theme toggle
- **AI Interview Bot** - pick a role, answer 5 AI-generated MCQs and get a score, level and salary estimate
- Server-side scoring (answers never reach the browser) and 10 requests/day per IP rate limit

## Tech stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** FastAPI, SlowAPI (rate limiting), Pydantic
- **AI:** LangChain with [Groq](https://console.groq.com) (free tier, default model `llama-3.3-70b-versatile`)

## Run locally

1. Create and activate a virtual environment: `python -m venv venv`
2. Install dependencies: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and set your free Groq key from <https://console.groq.com/keys>:

```env
   GROQ_API_KEY=your_groq_api_key_here
   # Optional: GROQ_MODEL=llama-3.1-8b-instant
```

4. Start the server: `uvicorn main:app --reload`
5. Open <http://127.0.0.1:8000> (the backend also serves the website)

Health check: <http://127.0.0.1:8000/api/health>

## Project structure

```text
main.py              FastAPI app, routes, static serving
backend/interview.py LLM logic, scoring, session store
schema/payload.py    Pydantic schemas
pages/               HTML pages
css/  js/  assets/   Styles, scripts and images
```

## License

All rights reserved. &copy; 2026 Quadra Collective.
