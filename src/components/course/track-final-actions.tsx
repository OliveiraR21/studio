"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Loader2, Award, Linkedin } from "lucide-react";
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

    const handleCompleteTrack = async () => {
        setIsCompleting(true);
        const result = await completeTrackForUser(trackId);
        if (result.success) {
            toast({
                title: "Trilha Concluída!",
                description: "Seu progresso foi salvo com sucesso.",
            });
            router.refresh();
        } else {
            toast({
                variant: "destructive",
                title: "Erro",
                description: result.message,
            });
            setIsCompleting(false);
        }
    };

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

    const handleShareOnLinkedIn = () => {
        const postText = `Estou feliz em compartilhar que concluí a trilha de conhecimento "${trackTitle}" na Br Supply Academy Stream! #DesenvolvimentoProfissional #BrSupply`;
        const encodedText = encodeURIComponent(postText);
        
        const linkedInUrl = `https://www.linkedin.com/compose/intent/feed/share?text=${encodedText}`;
        
        window.open(linkedInUrl, '_blank', 'noopener,noreferrer');

        toast({
            title: "Compartilhando no LinkedIn",
            description: "Uma nova aba foi aberta para você criar sua publicação."
        });
    };
    
    // If track is already completed, show certificate and feedback options.
    if (trackCompleted) {
        if (courseCount === 0 && !hasQuiz) {
            return null; // Don't show anything for an empty, completed track.
        }

        return (
            <Card className="bg-green-500/10">
                <CardHeader className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <CardTitle>Parabéns, trilha concluída!</CardTitle>
                    <CardDescription>Você finalizou a trilha "{trackTitle}".</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                    <Button 
                        onClick={handleDownloadCertificate} 
                        disabled={isDownloading}
                        size="lg"
                    >
                        {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Award className="mr-2 h-5 w-5" />}
                        {isDownloading ? 'Gerando...' : 'Baixar Certificado'}
                    </Button>
                    <Button 
                        size="lg"
                        onClick={handleShareOnLinkedIn}
                        className="bg-[#0A66C2] hover:bg-[#004182]"
                    >
                        <Linkedin className="mr-2 h-5 w-5" />
                        Publicar no LinkedIn
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
    
    // If the track is NOT complete, decide what action to show.

    // If there's a quiz, that's the final step.
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
                <Button size="sm" disabled={!allCoursesInTrackCompleted} onClick={handleStartQuiz}>
                    Iniciar Prova Final
                </Button>
            </div>
        );
    }

    // If there's NO quiz and all courses are done, show the "Finalizar Trilha" button.
    if (!hasQuiz && allCoursesInTrackCompleted) {
        return (
            <div className="flex items-center justify-center p-4 rounded-lg bg-muted/50">
                <Button size="lg" onClick={handleCompleteTrack} disabled={isCompleting}>
                    {isCompleting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Award className="mr-2 h-5 w-5" />}
                    {isCompleting ? 'Finalizando...' : 'Finalizar Trilha'}
                </Button>
            </div>
        );
    }

    // If none of the above conditions are met (e.g., courses not yet complete), show nothing.
    return null;
}
