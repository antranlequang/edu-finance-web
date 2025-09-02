'use client';
import { useState, useEffect, useRef } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { chat, Message } from "@/ai/flows/advisor-flow";
import { useToast } from "@/hooks/use-toast";

const quickPrompts = [
    "What scholarships can I apply for?",
    "Show me some free technology courses.",
    "Are there any remote internships?",
    "Give me tips for a job interview.",
];

export default function AiAdvicePage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [eduscore, setEduscore] = useState<number | undefined>();
    const { toast } = useToast();
    const scrollRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (prompt?: string) => {
        const userMessageText = prompt || input.trim();
        if (!userMessageText) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: userMessageText }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await chat({
                history: newMessages.slice(0, -1), // Send history without the latest user message
                prompt: userMessageText,
                eduscore: eduscore,
            });
            setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
        } catch (error) {
            console.error("Failed to get AI response", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to get a response from the AI advisor. Please try again.'
            });
             // Add the user message back if AI fails
            setMessages(prev => prev.slice(0,-1));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-secondary">
            <Header />
            <main className="flex-grow flex flex-col container mx-auto p-4">
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    {messages.length === 0 && (
                        <>
                           <div className="bg-primary/10 p-4 rounded-full mb-4">
                               <Bot className="w-16 h-16 text-primary" />
                           </div>
                           <h1 className="text-3xl font-bold">Your Personal AI Advisor</h1>
                           <p className="text-muted-foreground mt-2 max-w-lg">
                               Ask me anything about scholarships, courses, or jobs. I'm here to help you 24/7.
                           </p>
                        </>
                    )}
                     <div ref={scrollRef} className="w-full max-w-3xl flex-grow overflow-y-auto p-4 space-y-6">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
                                <div className={`rounded-lg p-3 max-w-lg text-left ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground flex-shrink-0" />}
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-start gap-3 justify-start">
                                <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                                <div className="rounded-lg p-3 bg-background flex items-center">
                                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="sticky bottom-0 pb-4 w-full max-w-3xl mx-auto bg-secondary">
                    {messages.length === 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                            {quickPrompts.map(prompt => (
                                <Button key={prompt} variant="outline" size="sm" className="bg-background h-auto py-2" onClick={() => handleSend(prompt)}>
                                    <p className="text-xs font-normal whitespace-normal">{prompt}</p>
                                </Button>
                            ))}
                        </div>
                    )}
                    <Card>
                        <CardContent className="p-2">
                             <div className="relative flex items-center">
                                <Input 
                                    placeholder="Ask for advice..." 
                                    className="pr-20 h-12 text-base border-none focus-visible:ring-0"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                    disabled={isLoading}
                                />
                                <div className="absolute right-2 flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
