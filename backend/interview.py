import os
from typing import List
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI  # ya langchain_mistralai / langchain_groq
from schema.payload import QuestionsResponseSchema, InterviewSubmitResponseSchema, SingleUserAnswer

# Setup LLM Model
# Note: Groq ya OpenAI ka cost-effective model (e.g., gpt-4o-mini ya llama-3.1-8b-instant) use karein
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    api_key=os.getenv("OPENAI_API_KEY")
)

async def generate_interview_questions(role: str) -> QuestionsResponseSchema:
    """
    LangChain Structured Output function to generate 5 role-specific MCQ questions.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert technical interviewer at QUADRA-STUDIO. "
                   "Generate 5 high-quality multiple choice technical questions for the specified role. "
                   "Each question MUST have exactly 4 options and the zero-based index of the correct answer."),
        ("human", "Generate interview questions for the target role: {role}")
    ])

    # Enforce structured Pydantic schema using LangChain's with_structured_output
    structured_llm = llm.with_structured_output(QuestionsResponseSchema)
    chain = prompt | structured_llm

    result = await chain.ainvoke({"role": role})
    return result


async def evaluate_interview_answers(role: str, user_answers: List[SingleUserAnswer]) -> InterviewSubmitResponseSchema:
    """
    LangChain function to evaluate submitted answers and estimate level and compensation range.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an AI hiring lead evaluating candidate performance. "
                   "Analyze the submitted answers, calculate exact score percentage, "
                   "determine qualification level (e.g. Junior, Mid-Level, Senior), "
                   "and estimate a fair annual salary match range in USD or INR."),
        ("human", "Target Role: {role}\nSubmitted Answers Data: {user_answers}")
    ])

    structured_llm = llm.with_structured_output(InterviewSubmitResponseSchema)
    chain = prompt | structured_llm

    # LLM execution for evaluation
    result = await chain.ainvoke({
        "role": role,
        "user_answers": [answer.model_dump() for answer in user_answers]
    })
    return result