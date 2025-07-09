"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Loader2, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { completeTrackForUser } from "@/actions/track-actions";
import { generateCertificatePdf } from "@/actions/certificate-actions";
import type { User } from "@/lib/types";


interface TrackFinalActionsProps {
    trackId: string;
    hasQuiz: boolean;
    allCoursesInTrackCompleted: boolean;
    trackCompleted: boolean;
    trackTitle: string;
    courseCount: number;
    currentUser: User;
}

export function TrackFinalActions({ trackId, hasQuiz, allCoursesInTrackCompleted, trackCompleted, trackTitle, courseCount, currentUser }: TrackFinalActionsProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isCompleting, setIsCompleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [feedbackState, setFeedbackState] = useState<'pending' | 'sent'>('pending');

    useEffect(() => {
        if (allCoursesInTrackCompleted && !trackCompleted && !hasQuiz && !isCompleting) {
            setIsCompleting(true);
            completeTrackForUser(trackId).then(() => {
                // The page will refresh and show the updated state.
                router.refresh();
            });
        }
    }, [allCoursesInTrackCompleted, trackCompleted, hasQuiz, trackId, isCompleting, router]);


    const handleStartQuiz = () => {
        toast({ title: "Funcionalidade em desenvolvimento", description: "A prova final da trilha ainda não foi implementada." });
    };

    const handleFeedback = () => {
        setFeedbackState('sent');
        toast({ title: "Obrigado pelo seu feedback!", description: `Sua avaliação para a trilha "${trackTitle}" foi registrada.` });
    };
    
    const handleDownloadCertificate = async () => {
        setIsDownloading(true);
        toast({ title: 'Gerando seu certificado...', description: 'Isso pode levar alguns segundos.' });
        try {
            const pdfDataUri = await generateCertificatePdf({
                userName: currentUser.name,
                trackName: trackTitle,
            });

            const link = document.createElement('a');
            link.href = pdfDataUri;
            link.download = `Certificado-${trackTitle.replace(/ /g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Erro ao gerar certificado',
                description: error instanceof Error ? error.message : 'Tente novamente.',
            });
        } finally {
            setIsDownloading(false);
        }
    };
    
    // While auto-completing, show a loader.
    if (isCompleting) {
        return (
            <div className="flex items-center justify-center p-4 rounded-lg bg-muted/50 text-muted-foreground">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                <p className="font-semibold text-sm">Finalizando trilha...</p>
            </div>
        );
    }
    
    // If track is completed, show certificate and feedback options.
    if (trackCompleted) {
        // If there's no content to give feedback on, render nothing.
        if (courseCount === 0 && !hasQuiz) {
            return null;
        }

        return (
            <Card className="bg-green-500/10">
                <CardHeader className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <CardTitle>Parabéns, trilha concluída!</CardTitle>
                    <CardDescription>Você finalizou a trilha "{trackTitle}".</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button 
                        onClick={handleDownloadCertificate} 
                        disabled={isDownloading}
                        size="lg"
                    >
                        {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Award className="mr-2 h-5 w-5" />}
                        {isDownloading ? 'Gerando...' : 'Baixar Certificado'}
                    </Button>
                    {feedbackState === 'pending' && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="lg" onClick={handleFeedback}><ThumbsUp className="mr-2 h-5 w-5" /> Gostei</Button>
                            <Button variant="outline" size="lg" onClick={handleFeedback}><ThumbsDown className="mr-2 h-5 w-5" /> Não Gostei</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // If there's a quiz, show the "Prova Final" section (enabled or disabled).
    if (hasQuiz) {
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
    
    // If no quiz, and courses are not yet complete, nothing is shown. `useEffect` handles auto-completion.
    return null;
}
