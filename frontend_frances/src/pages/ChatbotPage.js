"use client"

import { useState, useRef, useEffect } from "react"
import { aiService } from "../services/aiService"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card"
import { Send, MessageCircle, User } from "react-feather"

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "Hello! I'm your AI health assistant. How can I help you today? You can ask me about medications, symptoms, or general health questions.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // BACKEND INTEGRATION POINT:
      // Send message to Flask backend which will use Gemini API
      const botMessage = await aiService.sendMessage(input)
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>AI Health Assistant</h1>
        <p className="text-gray-500">Ask questions about medications, symptoms, or general health information</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle style={{ color: 'var(--color-primary-dark)' }}>Chat with AI Assistant</CardTitle>
          <CardDescription>Your conversations are private and not stored permanently</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
                      message.sender === "user" 
                        ? "ml-2" 
                        : "mr-2"
                    }`}
                    style={{ 
                      backgroundColor: message.sender === "user" 
                        ? 'var(--color-primary)' 
                        : '#f3f4f6'
                    }}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <MessageCircle className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === "user" 
                        ? "text-white" 
                        : "text-gray-900"
                    }`}
                    style={{ 
                      backgroundColor: message.sender === "user" 
                        ? 'var(--color-primary)' 
                        : '#f3f4f6'
                    }}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gray-100 mr-2">
                    <MessageCircle className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
                    <div className="flex space-x-2">
                      <div
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'var(--color-primary)',
                          animationDelay: "0ms" 
                        }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'var(--color-primary)',
                          animationDelay: "150ms" 
                        }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'var(--color-primary)',
                          animationDelay: "300ms" 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              style={{ 
                backgroundColor: 'var(--color-primary)',
                ['--tw-hover-bg']: 'var(--color-primary-dark)',
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ChatbotPage

