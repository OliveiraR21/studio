"use client"

import { useState } from "react";
import { CoursePlayer } from "@/components/course/course-player";
import { Quiz as QuizComponent } from "@/components/course/quiz";
import { findCourseById } from "@/lib/data";
import { notFound, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Lightbulb, Video, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";

const PASSING_SCORE = 70;

export default function CoursePage() {
  const params = useParams<{ id: string }>();
  const result = findCourseById(params.id);
  const router = useRouter();

  const [view, setView] = useState<'video' | 'quiz'>(result?.course.quiz ? 'video' : 'video');
  const [quizFinished, setQuizFinished] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  if (!result) {
    notFound();
  }

  const { course, track } = result;

  const handleQuizComplete = (score: number) => {
    // In a real app, you would find the user's score record in the database,
    // increment the attempts, and replace the old score with the new one.
    console.log(`Quiz for course ${course.id} completed with score: ${score}. This would be saved to the database.`);
    setLastScore(score);
    
    if (score >= PASSING_SCORE) {
      setQuizFinished(true);
      // In a real app, you would also mark the course as "completed" in the user's progress.
    } else {
      setQuizFinished(false);
    }
    setView('video'); // Go back to the main view to show the result card
  };

  const handleFinishCourse = () => {
    // In a real app, mark the course as complete and redirect.
    router.push('/dashboard');
  }
  
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
            
            {view === 'video' && lastScore === null && (
                <CoursePlayer videoUrl={course.videoUrl} title={course.title} />
            )}

            {/* --- Result Cards --- */}
            {view === 'video' && lastScore !== null && (
              quizFinished ? (
                 <Card className="bg-green-500/10 border-green-500/20 text-center p-8">
                    <ThumbsUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <CardTitle className="text-2xl">Parabéns, você passou!</CardTitle>
                    <CardDescription className="mt-2">
                      Sua nota foi {lastScore}%. Você pode finalizar o curso ou refazer o questionário para tentar uma nota maior.
                    </CardDescription>
                    <div className="flex gap-4 justify-center mt-6">
                        <Button onClick={handleFinishCourse}>Finalizar Curso</Button>
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
                                    disabled={view === 'quiz'}
                                >
                                    {quizFinished ? 'Questionário Concluído' : (lastScore !== null ? 'Tentar Novamente' : 'Iniciar Questionário')}
                                </Button>
                            </>
                        ) : (
                             <Button 
                                className="w-full" 
                                onClick={handleFinishCourse}
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
