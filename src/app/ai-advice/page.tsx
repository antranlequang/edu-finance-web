'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Sparkles, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}


export default function AIAdvicePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Assistant for scholarships and education. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [eduscore, setEduscore] = useState<number | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);
  const { toast } = useToast();


  useEffect(() => {
    const storedResult = localStorage.getItem('eduscoreResult');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        setEduscore(result.eduscore);
      } catch (e) {
        console.error("Failed to parse eduscoreResult", e);
      }
    }
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Only scroll to bottom when a new message is added
  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    shouldScrollRef.current = true;
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            content: msg.content
          })),
          prompt: currentInput,
          eduscore: eduscore,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      shouldScrollRef.current = true;
    } catch (error) {
      console.error("Failed to get AI response", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI advisor. Please try again.'
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now, but I'm here to help! You can ask me about scholarships, courses, career advice, or EduScore improvements.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      shouldScrollRef.current = true;
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI Assistant for scholarships and education. How can I help you today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    shouldScrollRef.current = true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
      <Header />
      
      {/* AI Chat Header */}
      <header className="border-b border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-16 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-4 flex items-center">
          <div className="flex items-center gap-3 sm:gap-4 w-full">
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 sm:h-12 w-10 sm:w-12 bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <Bot className="h-5 sm:h-6 w-5 sm:w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 h-3 sm:h-4 w-3 sm:w-4 bg-green-400 rounded-full animate-pulse shadow-lg ring-2 ring-white dark:ring-gray-900" />
              <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 sm:gap-2">
                <h1 className="font-bold text-base sm:text-lg md:text-xl bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent whitespace-nowrap truncate">
                  HYHAN AI Education Assistant
                </h1>
                <div className="flex items-center gap-1 text-xs sm:text-sm flex-shrink-0">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap hidden xs:inline">Powered by Advanced AI</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap xs:hidden">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col h-[calc(100vh-160px)]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-3 duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 shrink-0 shadow-lg ring-2 ring-blue-200/50 dark:ring-blue-800/50">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={`max-w-[75%] p-5 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white ml-auto border-0 shadow-blue-200/50 dark:shadow-blue-800/50"
                      : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed text-pretty whitespace-pre-wrap">{message.content}</p>
                  <time
                    className={`text-xs mt-3 block flex items-center gap-1 ${
                      message.sender === "user" ? "text-white/80" : "text-blue-600/70 dark:text-blue-400/70"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {message.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </Card>

                {message.sender === "user" && (
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-gray-500 to-gray-600 shrink-0 shadow-lg ring-2 ring-gray-200/50 dark:ring-gray-700/50">
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 justify-start animate-in slide-in-from-bottom-3 duration-300">
                <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 shrink-0 shadow-lg ring-2 ring-blue-200/50 dark:ring-blue-800/50">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      AI is analyzing and preparing response...
                    </span>
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-blue-200/50 dark:border-blue-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about scholarships, courses, careers, or EduScore..."
                  className="pr-12 min-h-[48px] bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600 focus:ring-blue-400/20 dark:focus:ring-blue-600/20 shadow-sm transition-all duration-300"
                  disabled={isTyping}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="h-12 px-6 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-3 text-center">
              Press Enter to send • Shift + Enter for new line • AI-powered education guidance
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
