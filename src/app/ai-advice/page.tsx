'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, Clock, Zap, Trash2, History, CheckCircle, AlertCircle, MessageSquare, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-neon";
import { useEduscore } from "@/lib/eduscore-service";
import { useChatHistory } from "@/lib/chat-history-service";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export default function AIAdvicePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);
  const { toast } = useToast();
  const { getRecommendationContext } = useEduscore();
  const { loadHistory, saveHistory, clearHistory } = useChatHistory(user?.id);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // LocalStorage chat management functions
  const saveChatSession = (sessionId: string, messages: Message[]) => {
    try {
      const session = {
        id: sessionId,
        messages,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(session));
      
      // Update sessions list
      const sessions = getChatSessions();
      const existingIndex = sessions.findIndex(s => s.id === sessionId);
      const newSession: ChatSession = {
        id: sessionId,
        title: messages.length > 1 ? messages[1].content.substring(0, 50) + '...' : 'New Chat',
        lastMessage: messages[messages.length - 1]?.content || '',
        timestamp: new Date(),
        messageCount: messages.length
      };

      if (existingIndex >= 0) {
        sessions[existingIndex] = newSession;
      } else {
        sessions.unshift(newSession);
      }
      
      localStorage.setItem('chat_sessions', JSON.stringify(sessions.slice(0, 10))); // Keep only last 10
      setChatSessions(sessions.slice(0, 10));
    } catch (error) {
      console.error('Failed to save chat session:', error);
    }
  };

  const loadChatSession = (sessionId: string): Message[] => {
    try {
      const stored = localStorage.getItem(`chat_session_${sessionId}`);
      if (stored) {
        const session = JSON.parse(stored);
        return session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load chat session:', error);
    }
    return [];
  };

  const getChatSessions = (): ChatSession[] => {
    try {
      const stored = localStorage.getItem('chat_sessions');
      if (stored) {
        return JSON.parse(stored).map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
    return [];
  };

  const createNewChatSession = () => {
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    
    const eduscoreContext = getRecommendationContext();
    const welcomeMessage = eduscoreContext 
      ? `Xin chào! Tôi là trợ lý AI của HYHAN. Tôi thấy bạn có EduScore ${eduscoreContext.eduscore}/100 và đang học ${eduscoreContext.major}. Tôi có thể giúp bạn tìm học bổng, khóa học và cơ hội việc làm phù hợp. Bạn muốn hỏi gì?`
      : `Xin chào! Tôi là trợ lý AI giáo dục của HYHAN. Tôi có thể giúp bạn về học bổng, khóa học, và cơ hội nghề nghiệp tại Việt Nam. Hãy hoàn thành EduScore để nhận được tư vấn cá nhân hóa nhé!`;

    const initialMessages = [{
      id: "1",
      content: welcomeMessage,
      sender: "ai" as const,
      timestamp: new Date(),
    }];
    
    setMessages(initialMessages);
    saveChatSession(newSessionId, initialMessages);
    shouldScrollRef.current = true;
  };

  useEffect(() => {
    // Load from shared chat history first
    const sharedHistory = loadHistory();
    
    if (sharedHistory.length > 0) {
      // Convert shared history to Message format
      const convertedMessages: Message[] = sharedHistory.map(msg => ({
        id: Date.now().toString() + Math.random(),
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(msg.timestamp || new Date())
      }));
      
      setMessages(convertedMessages);
      shouldScrollRef.current = true;
      
      // Create a session from the shared history
      const sessionId = Date.now().toString();
      setCurrentSessionId(sessionId);
      saveChatSession(sessionId, convertedMessages);
    } else {
      // Load chat sessions on component mount
      const sessions = getChatSessions();
      setChatSessions(sessions);
      
      // Load the most recent session or create new one
      if (sessions.length > 0) {
        const latestSession = sessions[0];
        setCurrentSessionId(latestSession.id);
        const messages = loadChatSession(latestSession.id);
        if (messages.length > 0) {
          setMessages(messages);
          shouldScrollRef.current = true;
        } else {
          createNewChatSession();
        }
      } else {
        createNewChatSession();
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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    shouldScrollRef.current = true;
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Use the API route instead of direct AI service call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            content: msg.content
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Save to localStorage
      saveChatSession(currentSessionId, finalMessages);
      
      // Save to shared chat history
      const sharedMessages = [
        { role: 'user' as const, content: currentInput, timestamp: new Date() },
        { role: 'model' as const, content: data.response, timestamp: new Date() }
      ];
      const currentSharedHistory = loadHistory();
      const updatedSharedHistory = [...currentSharedHistory, ...sharedMessages];
      saveHistory(updatedSharedHistory);
      
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
        content: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Tôi vẫn sẵn sàng giúp bạn về học bổng, khóa học, tư vấn nghề nghiệp, hoặc cải thiện EduScore!",
        sender: "ai",
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveChatSession(currentSessionId, finalMessages);
      
      // Save error to shared chat history too
      const sharedMessages = [
        { role: 'user' as const, content: currentInput, timestamp: new Date() },
        { role: 'model' as const, content: errorMessage.content, timestamp: new Date() }
      ];
      const currentSharedHistory = loadHistory();
      const updatedSharedHistory = [...currentSharedHistory, ...sharedMessages];
      saveHistory(updatedSharedHistory);
      
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
    clearHistory(); // Clear shared history
    createNewChatSession();
  };

  const loadSession = (sessionId: string) => {
    const messages = loadChatSession(sessionId);
    if (messages.length > 0) {
      setMessages(messages);
      setCurrentSessionId(sessionId);
      shouldScrollRef.current = true;
    }
  };

  const deleteSession = (sessionId: string) => {
    try {
      localStorage.removeItem(`chat_session_${sessionId}`);
      const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
      setChatSessions(updatedSessions);
      localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));
      
      if (sessionId === currentSessionId) {
        if (updatedSessions.length > 0) {
          loadSession(updatedSessions[0].id);
        } else {
          createNewChatSession();
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
        <Header />
        <main className="flex-grow flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show login required screen if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
        <Header />
        <main className="flex-grow flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="max-w-md w-full mx-auto p-8 text-center">
            <div className="bg-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <Bot className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Yêu Cầu Đăng Nhập</h2>
            <p className="text-gray-600 mb-6">
              Để sử dụng tính năng AI Tư Vấn, bạn cần đăng nhập vào tài khoản của mình.
              AI sẽ cung cấp lời khuyên được cá nhân hóa dựa trên hồ sơ EduScore của bạn.
            </p>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/login">Đăng Nhập</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register">Tạo Tài Khoản Mới</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
      <Header />
      
      {/* AI Chat Header */}
      <header className="border-b border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-16 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="h-8 px-3 gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
            >
              <History className="h-3 w-3" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="h-8 px-3 gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
            >
              <Trash2 className="h-3 w-3" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-160px)] relative">
        {/* Chat History Sidebar */}
        <div className={`${showHistory ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-r border-blue-200/50 dark:border-blue-800/50`}>
          {showHistory && (
            <div className="h-full flex flex-col p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-blue-900 dark:text-blue-100">Chat History</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {chatSessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      session.id === currentSessionId
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700'
                        : 'bg-white/80 dark:bg-gray-800/80'
                    }`}
                    onClick={() => loadSession(session.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {session.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                          {session.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {session.messageCount} messages
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {session.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
                {chatSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No chat history yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent text-justify">
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
                  <div className="text-sm leading-relaxed whitespace-pre-wrap [&>p]:mb-1 [&>p]:mt-0 [&>ul]:mb-1 [&>ol]:mb-1">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <time
                    className={`text-xs mt-3 flex items-center gap-1 ${
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
                  onKeyDown={handleKeyPress}
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
