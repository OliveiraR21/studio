"use client"

import { useState } from "react";
import { CoursePlayer } from "@/components/course/course-player";
import { Quiz as QuizComponent } from "@/components/course/quiz";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Lightbulb, Video, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { Course, Track } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { recordCourseFeedback } from "@/actions/course-actions";

const PASSING_SCORE = 90;

interface CoursePageClientProps {
    course: Course;
    track: Track;
}

export function CoursePageClient({ course, track }: CoursePageClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [view, setView] = useState<'video' | 'quiz'>(course.quiz ? 'video' : 'video');
  const [quizFinished, setQuizFinished] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [completionStep, setCompletionStep] = useState<'in_progress' | 'awaiting_feedback' | 'feedback_given'>('in_progress');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);


  if (!course || !track) {
    notFound();
  }
  
  const handleQuizComplete = (score: number) => {
    setLastScore(score);
    
    if (score >= PASSING_SCORE) {
      setQuizFinished(true);
      // In a real app, you would also mark the course as "completed" in the user's progress.
      console.log(`Quiz for course ${course.id} passed. Awaiting feedback.`);
    } else {
      setQuizFinished(false);
    }
    setView('video'); // Go back to the video view to show the result card
  };
  
  const handleRequestFeedback = () => {
    console.log(`Course ${course.id} finished. Requesting feedback.`);
    setCompletionStep('awaiting_feedback');
  };

  const handleCourseFeedback = async (feedbackType: 'like' | 'dislike') => {
    if (isSubmittingFeedback) return;
    setIsSubmittingFeedback(true);

    const result = await recordCourseFeedback(course.id, feedbackType);

    if (result.success) {
        setCompletionStep('feedback_given');
        toast({
            title: "Obrigado!",
            description: "Seu feedback foi registrado com sucesso.",
        });
        // Redirect after a short delay
        setTimeout(() => {
            router.push('/dashboard');
        }, 2000);
    } else {
        toast({
            variant: "destructive",
            title: "Erro",
            description: result.message,
        });
        setIsSubmittingFeedback(false);
    }
  };

  const handleStartQuiz = () => {
    setView('quiz');
    setLastScore(null);
    setQuizFinished(false);
  }

  return (
    <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Trilha: {track.title}
        </Button>
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Content: Video or Quiz */}
        <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground -mt-4">{course.description}</p>
            
            {completionStep === 'in_progress' && (
              <>
                {view === 'video' && lastScore === null && (
                    <CoursePlayer videoUrl={course.videoUrl} title={course.title} />
                )}
                
                {view === 'video' && lastScore !== null && (
                  quizFinished ? (
                     <Card className="bg-green-500/10 border-green-500/20 text-center p-8">
                        <ThumbsUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <CardTitle className="text-2xl">Parabéns, você passou!</CardTitle>
                        <CardDescription className="mt-2">
                          Sua nota foi {lastScore}%. Clique abaixo para finalizar o curso.
                        </CardDescription>
                        <div className="flex gap-4 justify-center mt-6">
                            <Button onClick={handleRequestFeedback}>Finalizar Curso</Button>
                            <Button variant="outline" onClick={handleStartQuiz}>Refazer Prova</Button>
                        </div>
                      </Card>
                  ) : (
                      <Card className="bg-red-500/10 border-red-500/20 text-center p-8">
                        <ThumbsDown className="h-12 w-12 text-red-600 mx-auto mb-4" />
                        <CardTitle className="text-2xl">Não foi desta vez...</CardTitle>
                        <CardDescription className="mt-2">
                          Sua nota foi {lastScore}%. Você precisa de no mínimo {PASSING_SCORE}% para ser aprovado.
                        </CardDescription>
                        <Button onClick={handleStartQuiz} className="mt-6">Tentar Novamente</Button>
                      </Card>
                  )
                )}

                {view === 'quiz' && course.quiz && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Hora do Questionário!</CardTitle>
                            <CardDescription className="flex items-center gap-2 pt-2">
                               <AlertCircle className="h-4 w-4" /> O vídeo não estará visível durante a prova.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <QuizComponent quiz={course.quiz} onQuizComplete={handleQuizComplete} />
                        </CardContent>
                    </Card>
                )}
              </>
            )}

            {completionStep === 'awaiting_feedback' && (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>O que você achou do conteúdo?</CardTitle>
                  <CardDescription>Seu feedback é anônimo e nos ajuda a melhorar.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-6">
                  <Button variant="outline" size="icon" className="h-20 w-20" disabled={isSubmittingFeedback} onClick={() => handleCourseFeedback('like')}>
                    {isSubmittingFeedback ? <Loader2 className="h-10 w-10 animate-spin" /> : <ThumbsUp className="h-10 w-10" />}
                  </Button>
                  <Button variant="outline" size="icon" className="h-20 w-20" disabled={isSubmittingFeedback} onClick={() => handleCourseFeedback('dislike')}>
                    <ThumbsDown className="h-10 w-10" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {completionStep === 'feedback_given' && (
              <Card className="flex flex-col items-center justify-center text-center p-8 bg-green-500/10 border-green-500/20">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">Feedback Recebido!</CardTitle>
                <CardDescription className="mt-2">
                  Obrigado por nos ajudar a melhorar. Você será redirecionado em breve.
                </CardDescription>
              </Card>
            )}
        </div>

        {/* Sidebar: Navigation & Actions */}
        <div className="lg:col-span-1">
            <div className="sticky top-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Progresso da Aula</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`flex items-center gap-3 p-3 rounded-md transition-colors ${view === 'video' ? 'bg-primary/10' : ''}`}>
                            <Video className={`h-6 w-6 ${view === 'video' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div>
                                <p className="font-semibold">1. Assistir Vídeo</p>
                                <p className="text-xs text-muted-foreground">Conteúdo principal da aula.</p>
                            </div>
                        </div>

                        {course.quiz ? (
                            <>
                                <div className={`flex items-center gap-3 p-3 rounded-md transition-colors ${view === 'quiz' ? 'bg-primary/10' : ''} ${quizFinished ? 'bg-green-500/10' : ''}`}>
                                    <Lightbulb className={`h-6 w-6 ${view === 'quiz' ? 'text-primary' : 'text-muted-foreground'}  ${quizFinished ? 'text-green-500' : ''}`} />
                                    <div>
                                        <p className="font-semibold">2. Fazer Questionário</p>
                                        <p className="text-xs text-muted-foreground">Teste seu conhecimento.</p>
                                    </div>
                                </div>
                                <Button 
                                    className="w-full" 
                                    onClick={handleStartQuiz}
                                    disabled={view === 'quiz' || completionStep !== 'in_progress'}
                                >
                                    {quizFinished ? 'Questionário Concluído' : (lastScore !== null ? 'Tentar Novamente' : 'Iniciar Questionário')}
                                </Button>
                            </>
                        ) : (
                             <Button 
                                className="w-full" 
                                onClick={handleRequestFeedback}
                                disabled={completionStep !== 'in_progress'}
                            >
                                Marcar como Concluído
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
