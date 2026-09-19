import os
from typing import List
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI
from schema.payload import QuestionsResponseSchema, InterviewSubmitResponseSchema, SingleUserAnswer

# Setup Mistral AI Model
# API Key environment variable se fetch hoga: MISTRAL_API_KEY
llm = ChatMistralAI(
    model="mistral-small-latest",  # Fast aur cost-effective model for structured output
    temperature=0.7,
    api_key=os.getenv("MISTRAL_API_KEY")
)

async def generate_interview_questions(role: str) -> QuestionsResponseSchema:
    """
    LangChain Structured Output function to generate 5 role-specific MCQ questions using Mistral AI.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert technical interviewer at QUADRA-STUDIO. "
                   "Generate 5 high-quality multiple choice technical questions for the specified role. "
                   "Each question MUST have exactly 4 options and the zero-based index of the correct answer."),
        ("human", "Generate interview questions for the target role: {role}")
    ])

    structured_llm = llm.with_structured_output(QuestionsResponseSchema)
    chain = prompt | structured_llm

    result = await chain.ainvoke({"role": role})
    return result


async def evaluate_interview_answers(role: str, user_answers: List[SingleUserAnswer]) -> InterviewSubmitResponseSchema:
    """
    LangChain function to evaluate submitted answers using Mistral AI and estimate level and compensation range.
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

    result = await chain.ainvoke({
        "role": role,
        "user_answers": [answer.model_dump() for answer in user_answers]
    })
    return result