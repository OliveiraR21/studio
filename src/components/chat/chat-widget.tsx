"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { courseChatbot } from "@/ai/flows/course-chatbot";
import type { Course } from "@/lib/types";

type ChatMessage = {
    role: 'user' | 'model';
    content: string;
}

interface ChatWidgetProps {
    courses: Course[];
}

export function ChatWidget({ courses }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Olá! Sou seu assistente de carreira. Como posso te ajudar a encontrar o próximo curso ideal para você?" }
    ]);
    const [input, setInput] = useState("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const historyForGenkit = [...messages, userMessage].map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
        }));

        try {
            const availableTraining = courses.map(c => ({
                id: c.id,
                title: c.title,
                description: c.description,
                tags: c.tags || []
            }));
            
            const response = await courseChatbot({
                history: historyForGenkit,
                availableCourses: availableTraining,
            });

            const modelMessage: ChatMessage = { role: 'model', content: response };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = { role: 'model', content: "Desculpe, estou com problemas para me conectar. Tente novamente mais tarde." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
                size="icon"
                aria-label="Abrir chat do assistente"
            >
                {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
            </Button>

            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] flex flex-col shadow-xl z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    <CardHeader className="flex flex-row items-center justify-between border-b">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bot />
                            Assistente de Carreira
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                        {message.role === 'model' && <AvatarFor role="model" />}
                                        <div className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                         {message.role === 'user' && <AvatarFor role="user" />}
                                    </div>
                                ))}
                                {isLoading && (
                                     <div className="flex items-start gap-3">
                                        <AvatarFor role="model" />
                                        <div className="rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Digitando...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Enviar mensagem">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </>
    );
}

const AvatarFor = ({role}: {role: 'user' | 'model'}) => {
    if (role === 'model') {
        return <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5 text-primary-foreground" /></div>;
    }
    return <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0"><User className="h-5 w-5 text-muted-foreground" /></div>;
}
