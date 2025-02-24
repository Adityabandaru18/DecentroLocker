from fastapi import FastAPI
from pydantic import BaseModel
from Controllers.groq_implementation import PersonalChatBot

app = FastAPI()
client_chat_bot = PersonalChatBot()

class Message(BaseModel):
    role: str
    content: str

@app.get("/initial")
async def index():
    response = client_chat_bot.initial_prompt()
    return Message(role='assistant', content=response)

@app.post("/chat")
async def root(new_message: Message):
    response = client_chat_bot.chat(new_message.content)
    return Message(role='assistant', content=response)