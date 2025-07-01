import { getUsers, getLearningModules, findCourseById, findNextCourseForUser } from "@/lib/data-access";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, GaugeCircle, AlertTriangle, BookCheck, Play } from "lucide-react";
import Link from "next/link";
import type { Track, Course } from "@/lib/types";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { Separator } from "@/components/ui/separator";
import { UserNotFound } from "@/components/layout/user-not-found";

const PASSING_SCORE = 90;

// Helper function to format minutes into "Xh Ym"
const formatDuration = (totalMinutes: number) => {
    if (!totalMinutes || totalMinutes === 0) return "0m";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';
    if (hours > 0) {
        result += `${hours}h `;
    }
    if (minutes > 0 || hours === 0) {
        result += `${minutes}m`;
    }
    return result.trim();
};

export default async function DashboardPage() {
  // In a real app, this would be the logged-in user from a session.
  const allUsers = await getUsers();
  const currentUser = allUsers.find(u => u.id === '1'); // Simulating Admin login
  const learningModules = await getLearningModules();

  if (!currentUser) {
    return <UserNotFound />
  }
  
  const allCourses = learningModules.flatMap(module => module.tracks.flatMap(track => track.courses));
  const totalCourses = allCourses.length;
  const completedCoursesCount = currentUser.completedCourses.length;

  const allScores = [...(currentUser.courseScores ?? []).map(s => s.score), ...(currentUser.trackScores ?? []).map(s => s.score)];
  const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  const coursesToRetake = (currentUser.courseScores ?? [])
    .filter(scoreInfo => scoreInfo.score < PASSING_SCORE)
    .map(scoreInfo => {
        const courseDetails = findCourseById(scoreInfo.courseId, learningModules);
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

  const nextCourse = findNextCourseForUser(currentUser, learningModules);

  // Calculate training hours
  const totalDuration = allCourses.reduce((acc, course) => acc + (course.durationInMinutes || 0), 0);
  const completedCourses = allCourses.filter(course => currentUser.completedCourses.includes(course.id));
  const completedDuration = completedCourses.reduce((acc, course) => acc + (course.durationInMinutes || 0), 0);
  const pendingDuration = totalDuration - completedDuration;

  return (
    <div className="container mx-auto py-2 space-y-8">
       <div className="mb-6">
            <h1 className="text-3xl font-bold">Meu Painel</h1>
            <p className="text-muted-foreground">
                Um resumo do seu progresso e desempenho na plataforma.
            </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <CardContent className="flex flex-1 flex-col justify-between p-6">
                  <div className="text-center">
                      <div className="text-4xl font-bold tracking-tighter">{currentUser.completedTracks.length}</div>
                      <p className="text-sm text-muted-foreground">
                        de {learningModules.flatMap(m => m.tracks).length} no total
                      </p>
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground pt-4">
                      <Separator className="mb-2" />
                      <div className="flex justify-between w-full">
                          <span>Horas Concluídas:</span>
                          <span className="font-semibold text-foreground">{formatDuration(completedDuration)}</span>
                      </div>
                      <div className="flex justify-between w-full">
                          <span>Horas Pendentes:</span>
                          <span className="font-semibold text-foreground">{formatDuration(pendingDuration)}</span>
                      </div>
                  </div>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Acesso Rápido</CardTitle>
                <CardDescription>
                  Continue sua jornada de aprendizado.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col items-center justify-center">
                {nextCourse ? (
                    <Button asChild size="lg" className="w-full">
                        <Link href={`/courses/${nextCourse.id}`}>
                            <Play className="mr-2 h-5 w-5"/>
                            Continuar de onde parou
                        </Link>
                    </Button>
                ) : (
                    <div className="text-center">
                        <Trophy className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                        <p className="font-semibold">Parabéns!</p>
                        <p className="text-sm text-muted-foreground">Você concluiu todos os cursos.</p>
                    </div>
                )}
              </CardContent>
              {nextCourse && (
                <CardFooter className="text-xs text-muted-foreground justify-center text-center p-2">
                    Próxima aula: {nextCourse.title}
                </CardFooter>
              )}
            </Card>
        </div>
        
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
    </div>
  );
}
