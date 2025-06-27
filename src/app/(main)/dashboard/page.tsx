import { users, availableCourses } from "@/lib/data";
import { CourseCard } from "@/components/dashboard/course-card";
import { ProgressChart } from "@/components/dashboard/progress-chart";
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
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Target } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type { Course } from "@/lib/types";


export default function DashboardPage() {
  // For demonstration, we'll use the first user with quiz data.
  // In a real app, this would be the logged-in user from a session.
  const currentUser = users[0];
  
  const completedCount = currentUser.completedTraining.length;
  const totalCourses = availableCourses.length;

  const averageScore = currentUser.quizScores && currentUser.quizScores.length > 0
    ? currentUser.quizScores.reduce((acc, curr) => acc + curr.score, 0) / currentUser.quizScores.length
    : 0;

  const coursesToRetake = currentUser.quizScores
    ?.filter(score => score.score < 80)
    .map(score => {
      const course = availableCourses.find(c => c.id === score.courseId);
      // Ensure we found a course before creating the object
      if (course) {
        return { ...course, score: score.score };
      }
      return null;
    }).filter(Boolean) as ({ id: string, title: string, score: number})[]; // Filter out nulls and assert type
    
  const filterCoursesByTag = (tag: string) => {
    return availableCourses.filter(course => course.tags?.includes(tag));
  };
  
  const hardSkillsCourses = filterCoursesByTag('Hard Skills');
  const softSkillsCourses = filterCoursesByTag('Soft Skills');
  const humanMachineSkillsCourses = filterCoursesByTag('Human Machine Skills');

  const calculateTrackProgress = (courses: Course[], completedTraining: string[]) => {
    if (courses.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    const courseIds = courses.map(c => c.id);
    const completedInTrack = completedTraining.filter(id => courseIds.includes(id));
    return {
      completed: completedInTrack.length,
      total: courses.length,
      percentage: Math.round((completedInTrack.length / courses.length) * 100),
    };
  };

  const hardSkillsProgress = calculateTrackProgress(hardSkillsCourses, currentUser.completedTraining);
  const softSkillsProgress = calculateTrackProgress(softSkillsCourses, currentUser.completedTraining);
  const humanMachineSkillsProgress = calculateTrackProgress(humanMachineSkillsCourses, currentUser.completedTraining);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna da Esquerda: Estatísticas */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <ProgressChart completed={completedCount} total={totalCourses} />

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Notas
                </CardTitle>
                <CardDescription>Sua média e cursos para refazer.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground">Média Geral</p>
                    <p className="text-5xl font-bold tracking-tighter">{Math.round(averageScore)}%</p>
                </div>
                
                <Separator className="my-4" />

                <h4 className="text-sm font-semibold mb-3">Refazer Provas ({coursesToRetake.length})</h4>
                {coursesToRetake.length > 0 ? (
                    <div className="space-y-2">
                        {coursesToRetake.map(course => course && (
                            <Link href={`/courses/${course.id}`} key={course.id} className="block">
                                <div className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-destructive" />
                                        <div>
                                            <p className="text-sm font-medium">{course.title}</p>
                                            <p className="text-xs text-muted-foreground">Sua nota: {course.score}%</p>
                                        </div>
                                    </div>
                                    <Badge variant="destructive">Refazer</Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Parabéns! Nenhuma prova para refazer.</p>
                )}
            </CardContent>
        </Card>
      </div>

      {/* Coluna da Direita: Trilhas e IA */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Tabs defaultValue="hard-skills" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Trilhas de Conhecimento</CardTitle>
              <TabsList className="grid w-full grid-cols-3 mt-2">
                <TabsTrigger value="hard-skills">Hard Skills</TabsTrigger>
                <TabsTrigger value="soft-skills">Soft Skills</TabsTrigger>
                <TabsTrigger value="human-machine-skills">Human-Machine</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="hard-skills">
                <div className="text-sm text-muted-foreground mb-4">
                    Progresso da trilha: {hardSkillsProgress.completed} de {hardSkillsProgress.total} cursos ({hardSkillsProgress.percentage}%)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hardSkillsCourses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>
              </TabsContent>
              <TabsContent value="soft-skills">
                 <div className="text-sm text-muted-foreground mb-4">
                    Progresso da trilha: {softSkillsProgress.completed} de {softSkillsProgress.total} cursos ({softSkillsProgress.percentage}%)
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {softSkillsCourses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>
              </TabsContent>
              <TabsContent value="human-machine-skills">
                 <div className="text-sm text-muted-foreground mb-4">
                    Progresso da trilha: {humanMachineSkillsProgress.completed} de {humanMachineSkillsProgress.total} cursos ({humanMachineSkillsProgress.percentage}%)
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {humanMachineSkillsCourses.length > 0 ? (
                        humanMachineSkillsCourses.map(course => <CourseCard key={course.id} course={course} />)
                    ) : (
                        <div className="col-span-2 text-center text-muted-foreground p-8">
                            Nenhum curso encontrado nesta trilha ainda.
                        </div>
                    )}
                 </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
