"use client"

import { useState } from "react";
import { CoursePlayer } from "@/components/course/course-player";
import { Quiz as QuizComponent } from "@/components/course/quiz";
import { findCourseById } from "@/lib/data";
import { notFound, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Lightbulb, Video } from "lucide-react";

export default function CoursePage() {
  const params = useParams<{ id: string }>();
  const result = findCourseById(params.id);
  const router = useRouter();

  const [view, setView] = useState<'video' | 'quiz'>(result?.course.quiz ? 'video' : 'video');
  const [quizFinished, setQuizFinished] = useState(false);

  if (!result) {
    notFound();
  }

  const { course, track } = result;

  const handleQuizComplete = (score: number) => {
    console.log(`Quiz for course ${course.id} completed with score: ${score}`);
    setQuizFinished(true);
    // In a real app, you would save the score and progress to the database here.
    // If the score is high enough, you would unlock the next course.
  };

  const handleFinishCourse = () => {
    // In a real app, mark the course as complete and redirect.
    router.push('/dashboard');
  }

  return (
    <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Trilha: {track.title}
        </Button>
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Content: Video or Quiz */}
        <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-6">{course.description}</p>
            
            {view === 'video' && (
                <CoursePlayer videoUrl={course.videoUrl} title={course.title} />
            )}

            {view === 'quiz' && course.quiz && !quizFinished && (
                <Card>
                    <CardHeader>
                        <CardTitle>Hora do Questionário!</CardTitle>
                        <CardDescription>
                            Teste seus conhecimentos sobre o que você acabou de aprender. O vídeo não estará visível durante a prova.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <QuizComponent quiz={course.quiz} onQuizComplete={handleQuizComplete} />
                    </CardContent>
                </Card>
            )}

             {view === 'quiz' && quizFinished && (
                <Card className="bg-green-500/10 border-green-500/20 text-center p-8">
                    <CardTitle className="text-2xl">Parabéns!</CardTitle>
                    <CardDescription>
                        Você concluiu o questionário. Clique abaixo para finalizar o curso e voltar para a trilha.
                    </CardDescription>
                    <Button onClick={handleFinishCourse} className="mt-4">
                        Finalizar Curso
                    </Button>
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
                                    onClick={() => setView('quiz')}
                                    disabled={view === 'quiz' || quizFinished}
                                >
                                    {quizFinished ? 'Questionário Concluído' : 'Iniciar Questionário'}
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
