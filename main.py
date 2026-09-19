import os
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Schemas and Core Backend Import
from schema.payload import (
    QuestionsResponseSchema, 
    InterviewSubmitRequestSchema, 
    InterviewSubmitResponseSchema
)
from backend.backend import generate_interview_questions, evaluate_interview_answers

# IP based Limiter setup (10 Requests per Day)
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="QUADRA-STUDIO AI Assessment API",
    description="Rate-limited backend API for AI Interview Bot",
    version="1.0.0"
)

# Rate Limiter Error Handler Register
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production me apni domain specify kar sakte hain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/interview/questions", response_model=QuestionsResponseSchema)
@limiter.limit("10/day")  # Ek IP se din me sirf 10 baar questions fetch ho sakte hain
async def get_questions(request: Request, role: str):
    """
    Fetch AI generated technical interview questions based on candidate role.
    """
    if not role or role.strip() == "":
        raise HTTPException(status_code=400, detail="Role parameter is required.")
    
    try:
        data = await generate_interview_questions(role=role)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")


@app.post("/api/v1/interview/submit", response_model=InterviewSubmitResponseSchema)
@limiter.limit("10/day")  # Submit par bhi 10/day ki limit hai
async def submit_interview(request: Request, payload: InterviewSubmitRequestSchema):
    """
    Evaluate candidate answers via LangChain LLM and return score, qualification & salary match.
    """
    try:
        evaluation = await evaluate_interview_answers(
            role=payload.role, 
            user_answers=payload.user_answers
        )
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")