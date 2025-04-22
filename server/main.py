from fastapi import FastAPI
from pydantic import BaseModel
from Controllers.groq_implementation import PersonalChatBot
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()


origins = [
    "*", 
]

# Add CORSMiddleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow all origins or specify a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

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

if __name__ == '__main__':
    PORT = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=PORT)