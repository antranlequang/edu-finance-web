'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth-neon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, Send, Bot, User, Sparkles, TrendingUp, 
  Award, Search, BookOpen, DollarSign, Target, Lightbulb,
  FileText, ExternalLink, Star, ThumbsUp, ThumbsDown, Clock, Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'scholarship' | 'course' | 'tip' | 'document';
    title: string;
    description: string;
    url?: string;
    value?: string;
    deadline?: string;
  }>;
  suggestedActions?: Array<{
    label: string;
    action: string;
    icon?: string;
  }>;
}

interface ScholarshipRecommendation {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  matchScore: number;
  requirements: string[];
  applicationUrl: string;
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hello ${user?.name || 'there'}! 👋 I'm your AI assistant for education and scholarships. I can help you with:\n\n🎯 Find scholarships\n📊 Improve your EduScore\n📚 Course recommendations\n💡 Career guidance\n\nWhat would you like to know?`,
        timestamp: new Date(),
        suggestedActions: [
          { label: 'Find Scholarships', action: 'find_scholarships' },
          { label: 'Improve EduScore', action: 'improve_eduscore' },
          { label: 'Career Advice', action: 'career_advice' },
          { label: 'Course Recommendations', action: 'course_recommendations' }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [user?.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const mockScholarshipRecommendations: ScholarshipRecommendation[] = [
    {
      id: '1',
      name: 'Tech Leaders Scholarship',
      amount: '$5,000',
      deadline: '2024-12-15',
      eligibility: ['Computer Science major', 'GPA 3.5+', 'Leadership experience'],
      matchScore: 92,
      requirements: ['Transcript', 'Essay', 'Recommendation letter'],
      applicationUrl: '#'
    },
    {
      id: '2',
      name: 'Future Innovators Grant',
      amount: '$3,000',
      deadline: '2024-11-30',
      eligibility: ['STEM field', 'Research project', 'Undergraduate'],
      matchScore: 87,
      requirements: ['Portfolio', 'Project proposal', 'Academic records'],
      applicationUrl: '#'
    },
    {
      id: '3',
      name: 'Diversity in Tech Fund',
      amount: '$7,500',
      deadline: '2025-01-20',
      eligibility: ['Underrepresented groups', 'Technology focus', 'Community involvement'],
      matchScore: 85,
      requirements: ['Personal statement', 'Community service proof', 'Academic transcript'],
      applicationUrl: '#'
    }
  ];

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    try {
      const apiResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'model',
            content: msg.content
          })),
          prompt: userMessage,
          eduscore: user?.accountLevel ? user.accountLevel * 20 : undefined,
        }),
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date(),
          suggestedActions: [
            { label: 'Ask Another Question', action: 'continue' },
            { label: 'Find Scholarships', action: 'find_scholarships' },
            { label: 'Browse Courses', action: 'browse_courses' },
          ]
        };
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('AI API Error:', error);
      
      // Return error message with helpful suggestions
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I'm having trouble connecting right now, but I'm still here to help! You can try asking me about scholarships, courses, or career advice. I have lots of information to share!",
        timestamp: new Date(),
        suggestedActions: [
          { label: 'Find Scholarships', action: 'find_scholarships' },
          { label: 'Course Recommendations', action: 'course_recommendations' },
          { label: 'Career Advice', action: 'career_advice' },
        ]
      };
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedAction = (action: string) => {
    const actionMessages: { [key: string]: string } = {
      'find_scholarships': 'Find scholarships that match my profile',
      'improve_eduscore': 'How can I improve my EduScore?',
      'career_advice': 'Give me career advice',
      'course_recommendations': 'Recommend courses for me',
      'take_assessment': 'How do I take the assessment?',
      'upload_docs': 'Help me upload verification documents',
      'browse_courses': 'Show me available courses',
      'continue': 'Tell me more'
    };

    if (actionMessages[action]) {
      // Send the message directly instead of setting input
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: actionMessages[action],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      generateAIResponse(actionMessages[action])
        .then(aiResponse => {
          setMessages(prev => [...prev, aiResponse]);
        })
        .finally(() => {
          setIsTyping(false);
        });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 ring-4 ring-blue-200/50 dark:ring-blue-800/50">
          <div className="relative">
            <MessageSquare className="h-7 w-7" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full animate-pulse shadow-lg ring-2 ring-white"></div>
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col bg-gradient-to-br from-blue-50/90 via-white/90 to-cyan-50/90 dark:from-blue-950/90 dark:via-gray-900/90 dark:to-cyan-950/90 backdrop-blur-xl border-blue-200/50 dark:border-blue-800/50">
        <DialogHeader className="border-b border-blue-200/50 dark:border-blue-800/50 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full animate-pulse shadow-lg ring-2 ring-white dark:ring-gray-900"></div>
              <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                HYHAN AI Assistant
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Enhanced
                </Badge>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">AI-Powered</span>
                </div>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-blue-600/70 dark:text-blue-400/70 mt-2">
            Your personal AI guide for scholarships, career development, and educational opportunities
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm rounded-lg">
            <div className="space-y-6 p-4">
              {messages.map((message, index) => (
                <div key={message.id} className="space-y-4">
                  <div 
                    className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-500`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {message.type === 'assistant' && (
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 shrink-0 shadow-lg ring-2 ring-blue-200/50 dark:ring-blue-800/50">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <Card
                      className={`max-w-[75%] p-5 shadow-lg transition-all duration-300 hover:shadow-xl ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white ml-auto border-0 shadow-blue-200/50 dark:shadow-blue-800/50"
                          : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-pretty whitespace-pre-wrap">{message.content}</p>
                      <time
                        className={`text-xs mt-3 block flex items-center gap-1 ${
                          message.type === "user" ? "text-white/80" : "text-blue-600/70 dark:text-blue-400/70"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </time>
                    </Card>

                    {message.type === "user" && (
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-gray-500 to-gray-600 shrink-0 shadow-lg ring-2 ring-gray-200/50 dark:ring-gray-700/50">
                        <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {message.attachments && (
                    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={message.type === 'assistant' ? 'ml-14' : 'mr-14'}>
                        <div className="space-y-2 max-w-[80%]">
                          {message.attachments.map((attachment, index) => (
                            <Card key={index} className="p-3 bg-card/50 border-dashed">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {attachment.type === 'scholarship' && <Award className="h-4 w-4 text-yellow-500" />}
                                    {attachment.type === 'course' && <BookOpen className="h-4 w-4 text-blue-500" />}
                                    {attachment.type === 'tip' && <Lightbulb className="h-4 w-4 text-green-500" />}
                                    <span className="font-medium text-sm">{attachment.title}</span>
                                    {attachment.value && (
                                      <Badge variant="secondary" className="text-xs">
                                        {attachment.value}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{attachment.description}</p>
                                </div>
                                {attachment.url && (
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {message.suggestedActions && (
                    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={message.type === 'assistant' ? 'ml-14' : 'mr-14'}>
                        <div className="flex flex-wrap gap-2 max-w-[80%]">
                          {message.suggestedActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestedAction(action.action)}
                              className="text-xs gap-2 bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
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
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t border-blue-200/50 dark:border-blue-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
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
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
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
      </DialogContent>
    </Dialog>
  );
}