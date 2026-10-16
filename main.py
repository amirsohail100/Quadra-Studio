import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()  # FIX: load GROQ_API_KEY from .env before anything else

from backend.interview import (  # noqa: E402
    LLMConfigError,
    evaluate_interview_answers,
    generate_interview_questions,
)
from schema.payload import (  # noqa: E402
    InterviewSubmitRequestSchema,
    InterviewSubmitResponseSchema,
    QuestionsResponseSchema,
)

logger = logging.getLogger("quadra.api")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# IP based limiter (10 requests per day per endpoint)
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="QUADRA-STUDIO AI Assessment API",
    description="Rate-limited backend API for AI Interview Bot",
    version="1.0.1",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# FIX: allow_origins=["*"] cannot be combined with allow_credentials=True
# (browsers reject it). No cookies are used, so credentials are off.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production: ["https://your-domain.com"]
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/interview/questions", response_model=QuestionsResponseSchema)
@limiter.limit("10/day")
async def get_questions(request: Request, role: str):
    """Fetch AI generated technical interview questions for a role."""
    role = (role or "").strip()
    if not role:
        raise HTTPException(status_code=400, detail="Role parameter is required.")
    if len(role) > 80:
        raise HTTPException(status_code=400, detail="Role is too long.")
    try:
        return await generate_interview_questions(role=role)
    except LLMConfigError as e:
        logger.error("%s", e)
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:  # noqa: BLE001
        logger.exception("Question generation failed")
        raise HTTPException(status_code=502, detail=f"AI service error: {e}")


@app.post("/api/v1/interview/submit", response_model=InterviewSubmitResponseSchema)
@limiter.limit("10/day")
async def submit_interview(request: Request, payload: InterviewSubmitRequestSchema):
    """Score answers (server side) and return level + salary estimate."""
    try:
        return await evaluate_interview_answers(
            session_id=payload.session_id,
            role=payload.role,
            user_answers=payload.user_answers,
        )
    except KeyError as e:
        raise HTTPException(status_code=410, detail=str(e.args[0]))
    except Exception as e:  # noqa: BLE001
        logger.exception("Evaluation failed")
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {e}")


@app.get("/api/health")
async def health():
    return {"status": "ok", "llm_key_configured": bool(os.getenv("GROQ_API_KEY"))}


# ---- Serve the website itself (so `uvicorn main:app` runs everything) ----
# Only whitelisted folders are exposed - never .env, .git or Python source.
@app.get("/", include_in_schema=False)
async def index():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))


@app.get("/index.html", include_in_schema=False)
async def index_html():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))


for _folder in ("css", "js", "assets", "pages"):
    app.mount(
        f"/{_folder}",
        StaticFiles(directory=os.path.join(BASE_DIR, _folder), check_dir=False),
        name=_folder,
    )