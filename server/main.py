from fastapi import FastAPI
from pydantic import BaseModel
from Controllers.groq_implementation import PersonalChatBot

app = FastAPI()


class Message(BaseModel):
    role: str
    content: str

@app.get('/')
async def index():
    return "server is running!"

@app.post("/chat")
async def root(new_message: Message):
    client_chat_bot = PersonalChatBot()
    response = client_chat_bot.chat(new_message)
    return Message(role='assistant', content=response)