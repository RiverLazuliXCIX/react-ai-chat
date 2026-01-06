import os
from os import path

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel

load_dotenv('.env')

app_base = path.dirname(__file__)
app_root = path.join(app_base, '../')

app_host = os.environ.get("APP_HTTP_HOST", "127.0.0.1")
app_port = int(os.environ.get("APP_HTTP_PORT", 5000))
ai_agent_api_key = os.environ.get("GOOGLE_API_KEY")

if not ai_agent_api_key:
    raise ValueError("GOOGLE_API_KEY is not set in environment variables")

app = FastAPI()

model = ChatGoogleGenerativeAI(
    model="gemini-3-pro-preview",
    temperature=1.0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    api_key=ai_agent_api_key,
    streaming=True,
)


def generator(prompt: str):
    messages = [("human", prompt)]

    for chunk in model.stream(messages):
        if not chunk.text:
            continue

        yield chunk.text


class ChatRequest(BaseModel):
    prompt: str


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    return StreamingResponse(
        generator(request.prompt),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    uvicorn.run("server:app", host=app_host, reload=True, port=app_port)
