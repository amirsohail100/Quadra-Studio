from pydantic import BaseModel, Field
from typing import List

# ==========================================
# 1. GET /questions Schemas
# ==========================================

class QuestionItem(BaseModel):
    id: str = Field(..., description="Unique question identifier")
    question: str = Field(..., description="Interview question text")
    options: List[str] = Field(..., min_items=4, max_items=4, description="List of 4 options")
    correct_index: int = Field(..., ge=0, le=3, description="Index of the correct answer (0 to 3)")

class QuestionsResponseSchema(BaseModel):
    role: str = Field(..., description="Target role name selected by user")
    questions: List[QuestionItem] = Field(..., description="List of interview questions")


# ==========================================
# 2. POST /submit Schemas
# ==========================================

class SingleUserAnswer(BaseModel):
    question_id: str = Field(..., description="ID of the question answered")
    selected_option: int = Field(..., ge=0, le=3, description="Index of option selected by user")

class InterviewSubmitRequestSchema(BaseModel):
    role: str = Field(..., description="Selected candidate role")
    user_answers: List[SingleUserAnswer] = Field(..., description="Array of answers submitted by user")

class InterviewSubmitResponseSchema(BaseModel):
    score_percentage: float = Field(..., description="Overall calculated score percentage")
    correct_count: int = Field(..., description="Number of correct answers")
    total_questions: int = Field(..., description="Total number of evaluated questions")
    qualification_level: str = Field(..., description="AI generated level e.g. Senior / Qualified")
    estimated_salary_range: str = Field(..., description="AI estimated compensation match string")