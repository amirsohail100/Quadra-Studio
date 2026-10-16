import logging
import os
import time
import uuid
from typing import Dict, List, Optional

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate

from schema.payload import (
    GeneratedQuestionSet,
    InterviewSubmitResponseSchema,
    LevelAndSalary,
    QuestionItem,
    QuestionsResponseSchema,
    SingleUserAnswer,
)

# FIX: .env was never loaded before, so MISTRAL_API_KEY was always None.
load_dotenv()

logger = logging.getLogger("quadra.interview")

NUM_QUESTIONS = 5
SESSION_TTL_SECONDS = 60 * 60  # 1 hour

# session_id -> {"role", "correct": [int,...], "ids": [str,...], "created": float}
_SESSIONS: Dict[str, dict] = {}


class LLMConfigError(RuntimeError):
    """Raised when the LLM API key / config is missing."""


_llm = None


def get_llm():
    """Create the Mistral client lazily so the server can start without a key
    and return a clear error instead of crashing at import time."""
    global _llm
    if _llm is None:
        api_key = os.getenv("MISTRAL_API_KEY")
        if not api_key:
            raise LLMConfigError(
                "MISTRAL_API_KEY is not set. Create a .env file next to main.py "
                "with: MISTRAL_API_KEY=your_key_here"
            )
        from langchain_mistralai import ChatMistralAI

        _llm = ChatMistralAI(
            model=os.getenv("MISTRAL_MODEL", "mistral-small-latest"),
            temperature=0.7,
            api_key=api_key,
            timeout=60,
            max_retries=2,
        )
    return _llm


def _purge_expired() -> None:
    now = time.time()
    for sid in [s for s, v in _SESSIONS.items() if now - v["created"] > SESSION_TTL_SECONDS]:
        _SESSIONS.pop(sid, None)


async def generate_interview_questions(role: str) -> QuestionsResponseSchema:
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are an expert technical interviewer at QUADRA-STUDIO. "
         "Generate exactly {n} high-quality multiple choice technical questions "
         "for the specified role. Each question MUST have exactly 4 options and "
         "the zero-based index (0-3) of the single correct answer. "
         "Vary the position of the correct answer."),
        ("human", "Generate interview questions for the target role: {role}"),
    ])
    chain = prompt | get_llm().with_structured_output(GeneratedQuestionSet)

    generated: Optional[GeneratedQuestionSet] = None
    last_err: Optional[Exception] = None
    for attempt in range(2):  # one retry - structured output occasionally comes back malformed
        try:
            result = await chain.ainvoke({"role": role, "n": NUM_QUESTIONS})
            if isinstance(result, dict):
                result = GeneratedQuestionSet.model_validate(result)
            if result is not None and len(result.questions) >= 1:
                generated = result
                break
        except Exception as e:  # noqa: BLE001
            last_err = e
            logger.warning("Question generation attempt %s failed: %s", attempt + 1, e)
    if generated is None:
        raise RuntimeError(f"LLM did not return valid questions: {last_err}")

    questions = generated.questions[:NUM_QUESTIONS]
    ids = [f"q_{i + 1}" for i in range(len(questions))]

    _purge_expired()
    session_id = uuid.uuid4().hex
    _SESSIONS[session_id] = {
        "role": role,
        "correct": [q.correct_index for q in questions],
        "ids": ids,
        "created": time.time(),
    }

    return QuestionsResponseSchema(
        session_id=session_id,
        role=role,
        questions=[
            QuestionItem(id=ids[i], question=q.question, options=q.options)
            for i, q in enumerate(questions)
        ],
    )


def _fallback_level(score: float) -> LevelAndSalary:
    if score >= 80:
        return LevelAndSalary(qualification_level="Senior", estimated_salary_range="INR 15-25 LPA")
    if score >= 50:
        return LevelAndSalary(qualification_level="Mid-Level", estimated_salary_range="INR 8-15 LPA")
    return LevelAndSalary(qualification_level="Junior", estimated_salary_range="INR 3-8 LPA")


async def evaluate_interview_answers(
    session_id: str, role: str, user_answers: List[SingleUserAnswer]
) -> InterviewSubmitResponseSchema:
    _purge_expired()
    session = _SESSIONS.pop(session_id, None)  # one submission per session
    if session is None:
        raise KeyError("Session expired or not found. Please retake the assessment.")

    correct = session["correct"]
    ids = session["ids"]
    total = len(correct)
    answered = {a.question_id: a.selected_option for a in user_answers}

    # FIX: scoring is done here, deterministically. Previously the LLM never saw
    # the correct answers, so any score it returned was made up.
    correct_count = sum(1 for qid, ans in zip(ids, correct) if answered.get(qid) == ans)
    score = round((correct_count / total) * 100, 1) if total else 0.0

    try:
        prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are an AI hiring lead. Given a candidate's verified quiz score, "
             "decide a qualification level (Junior, Mid-Level or Senior) and a fair "
             "annual salary range string in INR (LPA). Be realistic and consistent "
             "with the score."),
            ("human",
             "Target Role: {role}\nCorrect answers: {correct} of {total} ({score}%)"),
        ])
        chain = prompt | get_llm().with_structured_output(LevelAndSalary)
        level = await chain.ainvoke(
            {"role": session["role"] or role, "correct": correct_count,
             "total": total, "score": score}
        )
        if isinstance(level, dict):
            level = LevelAndSalary.model_validate(level)
        if level is None:
            raise ValueError("empty LLM response")
    except Exception as e:  # noqa: BLE001
        # Score is already computed - don't fail the whole submit if only the
        # level/salary suggestion call fails.
        logger.warning("Level/salary LLM call failed, using fallback: %s", e)
        level = _fallback_level(score)

    return InterviewSubmitResponseSchema(
        score_percentage=score,
        correct_count=correct_count,
        total_questions=total,
        qualification_level=level.qualification_level,
        estimated_salary_range=level.estimated_salary_range,
    )
