import { users, learningModules, findCourseById } from "@/lib/data";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, PlayCircle, Star, Trophy, GaugeCircle, AlertTriangle, BookCheck } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import type { Track, Course } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { Separator } from "@/components/ui/separator";

// NOTE: All progress checking logic is for demonstration. 
// In a real app, you would save progress to a database after a user 
// completes a course or track quiz.

const PASSING_SCORE = 90;

export default function DashboardPage() {
  // In a real app, this would be the logged-in user from a session.
  const currentUser = users[0];
  
  // Calculations for "Meu Painel"
  const totalCourses = learningModules.reduce((sum, module) => sum + module.tracks.reduce((trackSum, track) => trackSum + track.courses.length, 0), 0);
  const completedCoursesCount = currentUser.completedCourses.length;

  const allScores = [...(currentUser.courseScores ?? []).map(s => s.score), ...(currentUser.trackScores ?? []).map(s => s.score)];
  const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  const totalTracks = learningModules.reduce((sum, module) => sum + module.tracks.length, 0);
  const completedTracksCount = currentUser.completedTracks.length;

  const coursesToRetake = (currentUser.courseScores ?? [])
    .filter(scoreInfo => scoreInfo.score < PASSING_SCORE)
    .map(scoreInfo => {
        const courseDetails = findCourseById(scoreInfo.courseId);
        return courseDetails ? { ...courseDetails.course, score: scoreInfo.score } : null;
    })
    .filter((course): course is Course & { score: number } => course !== null);

  const trackPerformance = (currentUser.trackScores ?? [])
    .map(scoreInfo => {
      let trackDetails: Track | null = null;
      for (const module of learningModules) {
        const foundTrack = module.tracks.find(t => t.id === scoreInfo.trackId);
        if (foundTrack) {
          trackDetails = foundTrack;
          break;
        }
      }
      return trackDetails ? { ...trackDetails, score: scoreInfo.score } : null;
    })
    .filter((track): track is Track & { score: number } => track !== null)
    .reverse(); // Newest first

  const isCourseCompleted = (courseId: string) => {
    return currentUser.completedCourses.includes(courseId);
  }

  const getTrackProgress = (track: Track) => {
    const completedCount = track.courses.filter(c => isCourseCompleted(c.id)).length;
    return (completedCount / track.courses.length) * 100;
  }

  const isTrackUnlocked = (track: Track, previousTrack?: Track) => {
    if (!previousTrack) return true; // The first track is always unlocked.
    
    return currentUser.completedTracks.includes(previousTrack.id);
  }

  const isCourseUnlocked = (course: Course, previousCourse?: Course) => {
    if (!previousCourse) return true; // First course in a track is always unlocked.
    
    // Check if the previous course is marked as complete.
    // In a real app, this would be the definitive source.
    const isPreviousCourseCompleted = isCourseCompleted(previousCourse.id);
    if (isPreviousCourseCompleted) return true;

    // If not marked complete, check if it had a quiz and if the user passed.
    if (previousCourse.quiz) {
      const previousCourseScore = currentUser.courseScores?.find(s => s.courseId === previousCourse.id)?.score ?? 0;
      return previousCourseScore >= PASSING_SCORE;
    }
    
    // If the previous course had no quiz, just being completed is enough (handled above).
    return isPreviousCourseCompleted;
  }

  return (
    <div className="container mx-auto py-2 space-y-8">
       <div className="mb-6">
            <h1 className="text-3xl font-bold">Meu Painel</h1>
            <p className="text-muted-foreground">
                Um resumo do seu progresso e desempenho na plataforma.
            </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ProgressChart completed={completedCoursesCount} total={totalCourses} />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                  Média Geral
                </CardTitle>
                <GaugeCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-bold tracking-tighter">{averageScore}%</div>
                <p className="text-sm text-muted-foreground">
                  Média de todas as provas
                </p>
                {trackPerformance.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3 text-left">
                      <h4 className="font-semibold text-sm text-center">Histórico de Trilhas</h4>
                      <ul className="space-y-2">
                        {trackPerformance.map((track, index) => (
                           <li key={index} className="text-sm">
                                <span className="text-muted-foreground">
                                    {track.title} | <span className={`font-bold ${track.score >= PASSING_SCORE ? 'text-green-500' : 'text-destructive'}`}>{track.score}%</span>
                                </span>
                           </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                  Trilhas Concluídas
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                  <div className="text-5xl font-bold tracking-tighter">{completedTracksCount}</div>
                  <p className="text-sm text-muted-foreground">
                    de {totalTracks} trilhas no total
                  </p>
              </CardContent>
            </Card>
        </div>
        
        {/* Courses to Retake Card */}
        <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <div>
                        <CardTitle>Pendências de Estudo</CardTitle>
                        <CardDescription>
                            Cursos com nota abaixo do esperado que precisam ser refeitos para progredir.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {coursesToRetake.length > 0 ? (
                    <ul className="space-y-3">
                        {coursesToRetake.map(course => (
                            <li key={course.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div className="flex flex-col">
                                    <span className="font-semibold">{course.title}</span>
                                    <span className="text-sm text-destructive">Sua nota: {course.score}%</span>
                                </div>
                                <Button size="sm" asChild>
                                    <Link href={`/courses/${course.id}`}>Refazer Prova</Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
                        <BookCheck className="h-10 w-10 text-green-500" />
                        <p className="font-semibold">Você está em dia com todas as suas provas!</p>
                        <p className="text-sm text-muted-foreground">Nenhuma pendência encontrada. Ótimo trabalho!</p>
                    </div>
                )}
            </CardContent>
        </Card>


      <div className="mb-6 pt-8">
            <h1 className="text-3xl font-bold">Minhas Trilhas de Conhecimento</h1>
            <p className="text-muted-foreground">
                Siga os módulos e trilhas para evoluir em sua carreira.
            </p>
        </div>
      <Tabs defaultValue={learningModules[0].id}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto">
          {learningModules.map(module => (
            <TabsTrigger key={module.id} value={module.id} className="h-full flex flex-col items-start p-4 text-left">
              <p className="font-bold text-lg">{module.title}</p>
              <p className="text-xs text-muted-foreground whitespace-normal">{module.description}</p>
            </TabsTrigger>
          ))}
        </TabsList>

        {learningModules.map(module => (
          <TabsContent key={module.id} value={module.id}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {module.tracks.map((track, trackIndex) => {
                 const previousTrack = trackIndex > 0 ? module.tracks[trackIndex - 1] : undefined;
                 const unlocked = isTrackUnlocked(track, previousTrack);
                 const progress = getTrackProgress(track);
                 const allCoursesInTrackCompleted = progress === 100;
                 const trackCompleted = currentUser.completedTracks.includes(track.id);

                 return (
                  <Card key={track.id} className={!unlocked ? 'bg-muted/50' : ''}>
                    <AccordionItem value={track.id} className="border-b-0">
                      <AccordionTrigger className={`p-6 ${!unlocked ? 'cursor-not-allowed' : ''}`} disabled={!unlocked}>
                        <div className="flex items-center gap-4 w-full">
                          {trackCompleted ? (
                             <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
                          ) : unlocked ? (
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">{trackIndex + 1}</div>
                          ) : (
                            <Lock className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex-grow text-left">
                              <h3 className="text-xl font-semibold">{track.title}</h3>
                              <p className="text-sm text-muted-foreground">{track.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Progress value={progress} className="w-full max-w-xs h-2" />
                                <span className="text-xs font-semibold text-muted-foreground">{Math.round(progress)}%</span>
                              </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <ul className="space-y-3 pl-12 border-l-2 border-dashed ml-4">
                           {track.courses.map((course, courseIndex) => {
                              const previousCourse = courseIndex > 0 ? track.courses[courseIndex - 1] : undefined;
                              const courseUnlocked = unlocked && isCourseUnlocked(course, previousCourse);
                              const completed = isCourseCompleted(course.id);
                              
                              return (
                                <li key={course.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {completed ? <CheckCircle className="h-5 w-5 text-green-500" /> : <PlayCircle className={`h-5 w-5 ${courseUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />}
                                    <span className={!courseUnlocked ? 'text-muted-foreground' : ''}>{course.title}</span>
                                    {course.quiz && <Badge variant="outline">Prova</Badge>}
                                  </div>
                                   <Button size="sm" asChild disabled={!courseUnlocked || completed}>
                                      <Link href={`/courses/${course.id}`}>
                                        {completed ? 'Revisar' : 'Iniciar'}
                                      </Link>
                                   </Button>
                                </li>
                              )
                           })}
                           <li className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <Star className={`h-5 w-5 ${allCoursesInTrackCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={!allCoursesInTrackCompleted ? 'text-muted-foreground' : 'font-semibold'}>Prova Final da Trilha</span>
                             </div>
                              <Button size="sm" disabled={!allCoursesInTrackCompleted || trackCompleted}>
                                {trackCompleted ? 'Revisar Nota' : 'Iniciar Prova Final'}
                              </Button>
                           </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                 )
              })}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
