
import { getLearningModules, findCourseById, findNextCourseForUser, getUsers } from "@/lib/data-access";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, GaugeCircle, AlertTriangle, BookCheck, Play, Info } from "lucide-react";
import Link from "next/link";
import type { Track, Course } from "@/lib/types";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { Separator } from "@/components/ui/separator";
import { UserNotFound } from "@/components/layout/user-not-found";
import { getCurrentUser } from "@/lib/auth";
import { userHasCourseAccess } from "@/lib/access-control";
import { AiSuggestionCard } from "@/components/dashboard/ai-suggestion-card";

const PASSING_SCORE = 90;

// Helper function to format seconds into "hh:mm:ss"
const formatDuration = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  const allModules = await getLearningModules();

  if (!currentUser) {
    return <UserNotFound />
  }
  
  // Filter all courses based on user's access rights using the new hierarchical logic
  const accessibleCourses = allModules.flatMap(module => module.tracks.flatMap(track => track.courses))
    .filter(course => userHasCourseAccess(currentUser, course));

  const totalCourses = accessibleCourses.length;
  const completedCoursesCount = currentUser.completedCourses.filter(courseId => accessibleCourses.some(c => c.id === courseId)).length;

  const allScores = [...(currentUser.courseScores ?? []).map(s => s.score), ...(currentUser.trackScores ?? []).map(s => s.score)];
  const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  // Correctly calculate the number of *valid* completed tracks.
  // A track is only considered completable if it has courses or a quiz.
  const allTracks = allModules.flatMap(m => m.tracks);
  const validCompletedTracks = currentUser.completedTracks.filter(trackId => {
      const track = allTracks.find(t => t.id === trackId);
      if (!track) return false; // Should not happen, but good for safety
      return track.courses.length > 0 || (track.quiz && track.quiz.questions.length > 0);
  });
  const completedTracksCount = validCompletedTracks.length;

  const coursesToRetakePromises = (currentUser.courseScores ?? [])
    .filter(scoreInfo => scoreInfo.score < PASSING_SCORE)
    .map(async scoreInfo => {
        const courseDetails = await findCourseById(scoreInfo.courseId);
        if (!courseDetails) return null;

        const { course } = courseDetails;
        // Check access for the course to retake
        if (userHasCourseAccess(currentUser, course)) {
            return { ...course, score: scoreInfo.score };
        }
        return null;
    });

  const coursesToRetake = (await Promise.all(coursesToRetakePromises))
    .filter((course): course is Course & { score: number } => course !== null);

  const trackPerformance = (currentUser.trackScores ?? [])
    .map(scoreInfo => {
      let trackDetails: Track | null = null;
      for (const module of allModules) {
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

  const nextCourse = await findNextCourseForUser(currentUser);

  // Calculate training hours based on accessible courses
  const totalDuration = accessibleCourses.reduce((acc, course) => acc + (course.durationInSeconds || 0), 0);
  const completedCourses = accessibleCourses.filter(course => currentUser.completedCourses.includes(course.id));
  const completedDuration = completedCourses.reduce((acc, course) => acc + (course.durationInSeconds || 0), 0);
  const pendingDuration = totalDuration - completedDuration;

  const completedTimePercentage = totalDuration > 0 ? Math.round((completedDuration / totalDuration) * 100) : 0;
  const pendingTimePercentage = 100 - completedTimePercentage;

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

            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                  Média Geral
                </CardTitle>
                <GaugeCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-center p-6 text-center">
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
                      <div className="text-5xl font-bold tracking-tighter">{completedTracksCount}</div>
                      <p className="text-sm text-muted-foreground">
                        de {allModules.flatMap(m => m.tracks).length} no total
                      </p>
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground pt-4">
                      <Separator className="mb-2" />
                      <div className="flex justify-between w-full items-baseline">
                          <span>Horas Concluídas:</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-semibold text-foreground">{formatDuration(completedDuration)}</span>
                            <span>({completedTimePercentage}%)</span>
                          </div>
                      </div>
                      <div className="flex justify-between w-full items-baseline">
                          <span>Horas Pendentes:</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-semibold text-foreground">{formatDuration(pendingDuration)}</span>
                            <span>({pendingTimePercentage}%)</span>
                          </div>
                      </div>
                  </div>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Acesso Rápido</CardTitle>
                <CardDescription>
                  Continue sua jornada de aprendizado.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-center">
                {nextCourse ? (
                    <Button asChild size="lg" className="font-semibold text-xs">
                        <Link href={`/courses/${nextCourse.id}`}>
                            <Play className="mr-2 h-4 w-4"/>
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

        <AiSuggestionCard user={currentUser} courses={accessibleCourses} />
        
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
