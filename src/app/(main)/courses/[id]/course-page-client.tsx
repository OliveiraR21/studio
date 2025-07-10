
"use client"

import { useState } from "react";
import { CoursePlayer } from "@/components/course/course-player";
import { Quiz as QuizComponent } from "@/components/course/quiz";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Lightbulb, Video, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { Course, Track } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { recordCourseFeedback, completeCourseForUser } from "@/actions/course-actions";
import { Textarea } from "@/components/ui/textarea";

const PASSING_SCORE = 90;

interface CoursePageClientProps {
    course: Course;
    track: Track;
    isAlreadyCompleted: boolean;
    initialFeedback: 'like' | 'dislike' | 'none';
}

export function CoursePageClient({ course, track, isAlreadyCompleted, initialFeedback }: CoursePageClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [view, setView] = useState<'video' | 'quiz'>(course.quiz ? 'video' : 'video');
  const [quizFinished, setQuizFinished] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  
  const [completionStep, setCompletionStep] = useState(isAlreadyCompleted ? 'completed' : 'in_progress');
  const [currentFeedback, setCurrentFeedback] = useState<'like' | 'dislike' | 'none'>(initialFeedback);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [likes, setLikes] = useState(course.likes || 0);
  const [dislikes, setDislikes] = useState(course.dislikes || 0);

  if (!course || !track) {
    notFound();
  }
  
  const handleQuizComplete = (score: number) => {
    setLastScore(score);
    if (score >= PASSING_SCORE) {
      setQuizFinished(true);
      // User must now click "Finalizar Curso" to proceed to feedback and completion.
    } else {
      setQuizFinished(false);
    }
    setView('video'); // Go back to the video view to show the result card
  };
  
  const handleFinishCourse = async () => {
    // This function should only be callable if the course isn't already completed.
    if (isAlreadyCompleted) return;

    const completionResult = await completeCourseForUser(course.id);
    if (completionResult.success) {
        setCompletionStep('completed');
        toast({
            title: "Curso Concluído!",
            description: "Seu progresso foi registrado com sucesso. Dê seu feedback!",
        });
    } else {
         toast({
            variant: "destructive",
            title: "Erro",
            description: completionResult.message,
        });
    }
  };

  const handleFeedbackClick = async (newFeedback: 'like' | 'dislike') => {
    if (isSubmittingFeedback) return;

    // Determine the type of action: giving new feedback, changing feedback, or undoing feedback.
    const feedbackToSend = currentFeedback === newFeedback ? 'none' : newFeedback;
    const oldFeedback = currentFeedback;
    
    // If user clicks dislike, always prompt for a reason unless they are undoing a dislike.
    if (feedbackToSend === 'dislike') {
        setCompletionStep('awaiting_dislike_reason');
        return;
    }

    setIsSubmittingFeedback(true);
    const feedbackResult = await recordCourseFeedback(course.id, feedbackToSend, oldFeedback);

    if (feedbackResult.success) {
        setCurrentFeedback(feedbackToSend);
        setLikes(feedbackResult.newLikes);
        setDislikes(feedbackResult.newDislikes);
    } else {
        toast({
            variant: "destructive",
            title: "Erro",
            description: feedbackResult.message,
        });
    }
    setIsSubmittingFeedback(false);
  };
  
  const handleSubmitDislikeFeedback = async () => {
    if (isSubmittingFeedback) return;
    setIsSubmittingFeedback(true);

    const oldFeedback = currentFeedback;
    const feedbackResult = await recordCourseFeedback(course.id, 'dislike', oldFeedback, feedbackText);

    if (feedbackResult.success) {
        setCurrentFeedback('dislike');
        setLikes(feedbackResult.newLikes);
        setDislikes(feedbackResult.newDislikes);
        setCompletionStep('completed'); // Return to the main completed view
        toast({
            title: 'Feedback Enviado!',
            description: 'Obrigado por nos ajudar a melhorar.',
        });
        router.push(`/meus-cursos?openTrack=${track.id}`);
    } else {
        toast({
            variant: "destructive",
            title: "Erro",
            description: feedbackResult.message,
        });
    }
    setIsSubmittingFeedback(false);
  };

  const handleStartQuiz = () => {
    setView('quiz');
    setLastScore(null);
    setQuizFinished(false);
  }

  const courseHasQuiz = !!course.quiz;
  // The complete button should only show if the course is not quiz-based AND is not already completed.
  const showCompleteButton = !courseHasQuiz && completionStep === 'in_progress' && !isAlreadyCompleted;
  const showFinalizeButton = courseHasQuiz && quizFinished && completionStep === 'in_progress' && !isAlreadyCompleted;

  return (
    <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => router.push(`/meus-cursos?openTrack=${track.id}`)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Meus Cursos
        </Button>
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Content: Video or Quiz */}
        <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            
            <div className="flex justify-between items-center -mt-2">
                <p className="text-muted-foreground">{course.description}</p>
                 {completionStep === 'completed' && (
                     <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => handleFeedbackClick('like')} disabled={isSubmittingFeedback}>
                            <ThumbsUp className={`mr-2 h-5 w-5 ${currentFeedback === 'like' ? 'text-primary' : ''}`} />
                            {likes}
                        </Button>
                         <Button variant="ghost" size="sm" onClick={() => handleFeedbackClick('dislike')} disabled={isSubmittingFeedback}>
                            <ThumbsDown className={`mr-2 h-5 w-5 ${currentFeedback === 'dislike' ? 'text-destructive' : ''}`} />
                            {dislikes}
                        </Button>
                    </div>
                )}
            </div>
            
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
                            <Button onClick={handleFinishCourse} disabled={!showFinalizeButton}>Finalizar Curso</Button>
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

            {completionStep === 'awaiting_dislike_reason' && (
              <Card>
                <CardHeader>
                  <CardTitle>Conte-nos mais</CardTitle>
                  <CardDescription>
                    Seu feedback nos ajuda a melhorar. O que podemos fazer diferente? (Opcional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Descreva sua experiência..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows={4}
                    />
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button variant="ghost" onClick={() => setCompletionStep('completed')} disabled={isSubmittingFeedback}>Cancelar</Button>
                    <Button onClick={handleSubmitDislikeFeedback} disabled={isSubmittingFeedback}>
                        {isSubmittingFeedback && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar Feedback
                    </Button>
                </CardFooter>
              </Card>
            )}

            {completionStep === 'completed' && (
              <CoursePlayer videoUrl={course.videoUrl} title={course.title} />
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
                        <div className={`flex items-center gap-3 p-3 rounded-md transition-colors ${view === 'video' ? 'bg-primary/10' : ''} ${isAlreadyCompleted ? 'bg-green-500/10' : ''}`}>
                             {isAlreadyCompleted ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Video className={`h-6 w-6 ${view === 'video' ? 'text-primary' : 'text-muted-foreground'}`} />}
                            <div>
                                <p className="font-semibold">1. Assistir Vídeo</p>
                                <p className="text-xs text-muted-foreground">Conteúdo principal da aula.</p>
                            </div>
                        </div>

                        {course.quiz ? (
                            <>
                                <div className={`flex items-center gap-3 p-3 rounded-md transition-colors ${view === 'quiz' ? 'bg-primary/10' : ''} ${quizFinished || isAlreadyCompleted ? 'bg-green-500/10' : ''}`}>
                                    {isAlreadyCompleted || quizFinished ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Lightbulb className={`h-6 w-6 ${view === 'quiz' ? 'text-primary' : 'text-muted-foreground'}`} />}
                                    <div>
                                        <p className="font-semibold">2. Fazer Questionário</p>
                                        <p className="text-xs text-muted-foreground">Teste seu conhecimento.</p>
                                    </div>
                                </div>
                                <Button 
                                    className="w-full" 
                                    onClick={handleStartQuiz}
                                    disabled={view === 'quiz' || isAlreadyCompleted}
                                >
                                    {isAlreadyCompleted ? 'Revisar Questionário' : (lastScore !== null && !quizFinished ? 'Tentar Novamente' : 'Iniciar Questionário')}
                                </Button>
                            </>
                        ) : (
                             <Button 
                                className="w-full" 
                                onClick={handleFinishCourse}
                                disabled={!showCompleteButton}
                            >
                                {isAlreadyCompleted ? 'Curso Concluído' : 'Marcar como Concluído'}
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
