'use client';

import { askAssistant } from '@/ai/flows/assistant-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Bot, MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o Brill, seu assistente virtual. Como posso ajudar você a encontrar o melhor treinamento hoje?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const history = messages
      .slice(1) // Remove initial greeting
      .reduce((acc, msg, i) => {
        if (i % 2 === 0 && messages[i + 1]) {
          acc.push({ user: msg.content, model: messages[i + 1].content });
        }
        return acc;
      }, [] as { user: string; model: string }[]);

    try {
      const assistantResponse = await askAssistant({
        question: userMessage.content,
        history,
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantResponse },
      ]);
    } catch (error) {
      console.error('AI chat failed:', error);
      toast({
        variant: 'destructive',
        title: 'Ocorreu um erro',
        description: 'Não foi possível se conectar ao assistente de IA.',
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, estou com problemas para me conectar. Por favor, tente novamente mais tarde.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const MarkdownRenderer = ({ children }: { children: string }) => (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <Link {...props} href={props.href || ''} className="text-primary underline hover:text-primary/80" />
        ),
        p: ({node, ...props}) => <p {...props} className="leading-relaxed" />
      }}
    >
      {children}
    </ReactMarkdown>
  );

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-full max-w-sm flex flex-col shadow-2xl">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="text-primary" /> Assistente Brill
            </CardTitle>
            <CardDescription>
              Tire suas dúvidas sobre os cursos
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0">
            <ScrollArea className="h-96 w-full p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>
                          <Bot />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <MarkdownRenderer>{message.content}</MarkdownRenderer>
                    </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback>
                            <Bot />
                            </AvatarFallback>
                        </Avatar>
                         <div className="max-w-[80%] rounded-lg px-4 py-2 text-sm bg-muted flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Digitando...
                        </div>
                   </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-6 border-t flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Digite sua pergunta..."
                className="flex-1"
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
