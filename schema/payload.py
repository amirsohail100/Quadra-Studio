from typing import List

from pydantic import BaseModel, Field


# ==========================================
# 1. LLM generation schema (internal - includes the answer key)
# ==========================================

class GeneratedQuestion(BaseModel):
    question: str = Field(..., description="Interview question text")
    options: List[str] = Field(
        ..., min_length=4, max_length=4, description="Exactly 4 answer options"
    )
    correct_index: int = Field(
        ..., ge=0, le=3, description="Zero-based index of the correct option (0 to 3)"
    )


class GeneratedQuestionSet(BaseModel):
    questions: List[GeneratedQuestion] = Field(
        ..., description="Exactly 5 multiple choice questions"
    )


class LevelAndSalary(BaseModel):
    qualification_level: str = Field(
        ..., description="Candidate level, e.g. Junior / Mid-Level / Senior"
    )
    estimated_salary_range: str = Field(
        ..., description="Fair annual salary range string, e.g. 'INR 6-9 LPA'"
    )


# ==========================================
# 2. GET /questions (public - NO answer key sent to browser)
# ==========================================

class QuestionItem(BaseModel):
    id: str = Field(..., description="Unique question identifier")
    question: str = Field(..., description="Interview question text")
    options: List[str] = Field(..., min_length=4, max_length=4)


class QuestionsResponseSchema(BaseModel):
    session_id: str = Field(..., description="Pass this back on submit")
    role: str = Field(..., description="Target role name selected by user")
    questions: List[QuestionItem]


# ==========================================
# 3. POST /submit
# ==========================================

class SingleUserAnswer(BaseModel):
    question_id: str = Field(..., description="ID of the question answered")
    selected_option: int = Field(..., ge=0, le=3, description="Index of option selected")


class InterviewSubmitRequestSchema(BaseModel):
    session_id: str = Field(..., description="session_id returned by /questions")
    role: str = Field(..., description="Selected candidate role")
    user_answers: List[SingleUserAnswer] = Field(..., description="Submitted answers")


class InterviewSubmitResponseSchema(BaseModel):
    score_percentage: float
    correct_count: int
    total_questions: int
    qualification_level: str
    estimated_salary_range: str
