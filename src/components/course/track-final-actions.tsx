"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface TrackFinalActionsProps {
    allCoursesInTrackCompleted: boolean;
    trackCompleted: boolean;
    trackTitle: string;
}

export function TrackFinalActions({ allCoursesInTrackCompleted, trackCompleted, trackTitle }: TrackFinalActionsProps) {
    const { toast } = useToast();
    // In a real app, this state would come from the user's progress data.
    const [feedbackState, setFeedbackState] = useState<'pending_quiz' | 'awaiting_feedback' | 'feedback_sent'>(trackCompleted ? 'awaiting_feedback' : 'pending_quiz');

    const handleStartQuiz = () => {
        toast({ title: "Funcionalidade em desenvolvimento", description: "A prova final da trilha ainda não foi implementada." });
    };

    const handleFeedback = () => {
        // Simulate sending feedback
        setFeedbackState('feedback_sent');
        toast({ title: "Obrigado pelo seu feedback!", description: `Sua avaliação para a trilha "${trackTitle}" foi registrada.` });
    };
    
    // Scenario 1: Track is completed and awaiting feedback.
    if (trackCompleted && feedbackState === 'awaiting_feedback') {
        return (
            <Card className="bg-muted/50">
                <CardHeader className="text-center">
                    <CardTitle>Parabéns por concluir a trilha!</CardTitle>
                    <CardDescription>O que você achou do conteúdo geral desta trilha?</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                    <Button variant="outline" size="lg" onClick={handleFeedback}><ThumbsUp className="mr-2 h-5 w-5" /> Gostei</Button>
                    <Button variant="outline" size="lg" onClick={handleFeedback}><ThumbsDown className="mr-2 h-5 w-5" /> Não Gostei</Button>
                </CardContent>
            </Card>
        );
    }
    
    // Scenario 2: Track is completed and feedback has been sent.
    if (trackCompleted && feedbackState === 'feedback_sent') {
        return (
            <div className="flex items-center justify-center p-4 rounded-lg bg-green-500/10 text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p className="font-semibold text-sm">Obrigado pelo seu feedback!</p>
            </div>
        );
    }

    // Default Scenario: Quiz is pending.
    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
            <Star className={`h-6 w-6 ${allCoursesInTrackCompleted ? 'text-amber-400' : 'text-muted-foreground'}`} />
            <div>
                <h4 className={`font-semibold ${!allCoursesInTrackCompleted ? 'text-muted-foreground' : ''}`}>Prova Final da Trilha</h4>
                <p className="text-xs text-muted-foreground">Conclua todos os cursos para desbloquear.</p>
            </div>
            </div>
            <Button size="sm" disabled={!allCoursesInTrackCompleted || trackCompleted} onClick={handleStartQuiz}>
            {trackCompleted ? 'Concluído' : 'Iniciar Prova Final'}
            </Button>
        </div>
    );
}
