import React, { useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import bot from "../assets/bot.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  async function fetchBotResponse(content: string) {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "user",  // Default to 'user'
          content,       // Pass the content received as input
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bot response");
      }

      const data: Message = await response.json();
      setMessages( dupMessages => [...dupMessages, data] );  // Add bot response to messages
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
}

  useEffect(() => {
    // Call the backend API to fetch the initial message with empty content
    fetchBotResponse("");
  }, []); 

  const handleSend = async () => {
      if (inputText.trim()) {
        setMessages(dupMessages => [...dupMessages, {role: "user", content: inputText} ]);
  
        // Simulate bot response
        await fetchBotResponse(inputText); 
  
        setInputText("");  // Clear input field
      }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-[450px] h-[500px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex justify-between items-center bg-indigo-600 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <img src={bot} alt="ChatBot" className="w-8 h-8" />
              <span className="text-white font-semibold">DigiLocker Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-600"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 animate-bounce"
        >
          <img src={bot} alt="ChatBot" className="w-12 h-12" />
        </button>
      )}
    </div>
  );
}
