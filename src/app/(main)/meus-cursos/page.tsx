import { getUsers, getLearningModules } from "@/lib/data-access";
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
import { CheckCircle, Lock, Star, NotebookText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Track, Course } from "@/lib/types";
import { CourseCard } from "@/components/dashboard/course-card";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const PASSING_SCORE = 90;

export default async function MyCoursesPage() {
  // In a real app, this would be the logged-in user from a session.
  const allUsers = await getUsers();
  const currentUser = allUsers.find(u => u.id === '1'); // Simulating Admin login
  const learningModules = await getLearningModules();

  if (!currentUser) {
    return <div>Usuário não encontrado</div>
  }

  const isCourseCompleted = (courseId: string) => {
    return currentUser.completedCourses.includes(courseId);
  }

  const getTrackProgress = (track: Track) => {
    if (track.courses.length === 0) return 0;
    const completedCount = track.courses.filter(c => isCourseCompleted(c.id)).length;
    return (completedCount / track.courses.length) * 100;
  }

  const isTrackUnlocked = (track: Track, previousTrack?: Track) => {
    if (!previousTrack) return true; // The first track is always unlocked.
    return currentUser.completedTracks.includes(previousTrack.id);
  }

  const isCourseUnlocked = (course: Course, isParentTrackUnlocked: boolean, previousCourse?: Course) => {
    if (!isParentTrackUnlocked) return false;
    if (!previousCourse) return true; // First course in a track is always unlocked.
    
    const isPreviousCourseCompleted = isCourseCompleted(previousCourse.id);
    if (isPreviousCourseCompleted) return true;

    // If previous course had a quiz, check score.
    if (previousCourse.quiz) {
      const previousCourseScore = currentUser.courseScores?.find(s => s.courseId === previousCourse.id)?.score ?? 0;
      return previousCourseScore >= PASSING_SCORE;
    }
    
    // If no quiz, just being marked complete is enough (handled above)
    return isPreviousCourseCompleted;
  }

  return (
    <div className="container mx-auto py-2 space-y-8">
      <div className="mb-6">
          <h1 className="text-3xl font-bold">Meus Cursos</h1>
          <p className="text-muted-foreground">
              Explore suas trilhas de conhecimento e continue sua jornada de aprendizado.
          </p>
      </div>
      <Tabs defaultValue={learningModules[0]?.id}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto">
          {learningModules.map(module => (
            <TabsTrigger key={module.id} value={module.id} className="h-full flex flex-col items-start p-4 text-left">
               <div className="flex items-center gap-3">
                 <NotebookText className="h-5 w-5" />
                 <p className="font-bold text-lg">{module.title}</p>
               </div>
              <p className="text-xs text-muted-foreground whitespace-normal mt-2">{module.description}</p>
            </TabsTrigger>
          ))}
        </TabsList>

        {learningModules.map(module => (
          <TabsContent key={module.id} value={module.id}>
            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={`track-${module.tracks[0]?.id}`}>
              {module.tracks.map((track, trackIndex) => {
                 const previousTrack = trackIndex > 0 ? module.tracks[trackIndex - 1] : undefined;
                 const unlocked = isTrackUnlocked(track, previousTrack);
                 const progress = getTrackProgress(track);
                 const allCoursesInTrackCompleted = progress === 100;
                 const trackCompleted = currentUser.completedTracks.includes(track.id);

                 return (
                  <Card key={track.id} className={!unlocked ? 'bg-muted/50' : ''}>
                    <AccordionItem value={`track-${track.id}`} className="border-b-0">
                      <AccordionTrigger className={`p-6 hover:no-underline ${!unlocked ? 'cursor-not-allowed' : ''}`} disabled={!unlocked}>
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
                        <div className="border-t pt-6">
                           <h4 className="text-md font-semibold mb-4">Cursos da Trilha</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {track.courses.map((course, courseIndex) => {
                                const previousCourse = courseIndex > 0 ? track.courses[courseIndex - 1] : undefined;
                                const courseUnlocked = isCourseUnlocked(course, unlocked, previousCourse);
                                const completed = isCourseCompleted(course.id);
                                
                                return (
                                  <CourseCard 
                                    key={course.id} 
                                    course={course}
                                    isUnlocked={courseUnlocked}
                                    isCompleted={completed}
                                  />
                                )
                            })}
                          </div>
                          
                          <Separator className="my-6" />

                          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                             <div className="flex items-center gap-3">
                               <Star className={`h-6 w-6 ${allCoursesInTrackCompleted ? 'text-amber-400' : 'text-muted-foreground'}`} />
                                <div>
                                    <h4 className={`font-semibold ${!allCoursesInTrackCompleted ? 'text-muted-foreground' : ''}`}>Prova Final da Trilha</h4>
                                    <p className="text-xs text-muted-foreground">Conclua todos os cursos para desbloquear.</p>
                                </div>
                             </div>
                              <Button size="sm" disabled={!allCoursesInTrackCompleted || trackCompleted}>
                                {trackCompleted ? 'Revisar Nota' : 'Iniciar Prova Final'}
                              </Button>
                           </div>
                        </div>
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
