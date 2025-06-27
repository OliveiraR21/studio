"use client";

import { useState } from 'react';
import type { User, Course } from '@/lib/types';
import { suggestTrainingAssignments } from '@/ai/flows/suggest-training-assignments';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { CourseCard } from './course-card';

interface AiSuggestionCardProps {
    user: User;
    courses: Course[];
}

export function AiSuggestionCard({ user, courses }: AiSuggestionCardProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<Course[]>([]);

    const handleGetSuggestions = async () => {
        setIsLoading(true);
        setSuggestions([]);

        try {
            const result = await suggestTrainingAssignments({
                userRole: user.role,
                completedTraining: user.completedTraining,
                availableTraining: courses.map(c => ({
                    id: c.id,
                    title: c.title,
                    description: c.description,
                    tags: c.tags || []
                })),
            });
            
            const suggestedCourses = courses.filter(c => result.suggestedTrainingIds.includes(c.id));
            setSuggestions(suggestedCourses);

            if (suggestedCourses.length > 0) {
                 toast({
                    title: "Sugestões encontradas!",
                    description: `Encontramos ${suggestedCourses.length} cursos que podem te interessar.`,
                });
            } else {
                 toast({
                    title: "Tudo em dia!",
                    description: `Não encontramos novas sugestões para você no momento.`,
                });
            }

        } catch (error) {
            console.error("AI suggestion failed:", error);
            toast({
                variant: "destructive",
                title: "Ocorreu um erro",
                description: "Falha ao gerar sugestões da IA. Por favor, tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-6 w-6 text-primary" />
                    Assistente de Carreira
                </CardTitle>
                <CardDescription>
                    Não sabe o que aprender em seguida? Peça uma sugestão para nossa IA.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                {isLoading ? (
                     <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4">Analisando seu perfil...</p>
                    </div>
                ) : suggestions.length === 0 ? (
                    <Button onClick={handleGetSuggestions}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Sugerir cursos
                    </Button>
                ) : (
                    <div className="w-full space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {suggestions.map(course => <CourseCard key={course.id} course={course} />)}
                        </div>
                        <Button onClick={handleGetSuggestions} variant="outline" className="w-full">
                            <Wand2 className="mr-2 h-4 w-4" />
                            Gerar novamente
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
