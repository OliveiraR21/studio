import { users, learningModules } from "@/lib/data";
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
import { CheckCircle, Lock, PlayCircle, Star } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import type { Track, Course } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

// NOTE: All progress checking logic is for demonstration. 
// In a real app, you would save progress to a database after a user 
// completes a course or track quiz.

export default function DashboardPage() {
  // In a real app, this would be the logged-in user from a session.
  const currentUser = users[0];
  
  const isCourseCompleted = (courseId: string) => {
    return currentUser.completedCourses.includes(courseId);
  }

  const getTrackProgress = (track: Track) => {
    const completedCount = track.courses.filter(c => isCourseCompleted(c.id)).length;
    return (completedCount / track.courses.length) * 100;
  }

  const isTrackUnlocked = (track: Track, previousTrack?: Track) => {
    if (!previousTrack) return true; // The first track is always unlocked.
    
    const isPreviousTrackCompleted = currentUser.completedTracks.includes(previousTrack.id);
    
    // In a real app, you'd check the score of the previous track's quiz.
    // const previousTrackScore = currentUser.trackScores?.find(s => s.trackId === previousTrack.id)?.score ?? 0;
    // return isPreviousTrackCompleted && previousTrackScore >= 80;

    return isPreviousTrackCompleted;
  }

  const isCourseUnlocked = (course: Course, previousCourse?: Course) => {
    if (!previousCourse) return true; // First course in a track is always unlocked.

    const isPreviousCourseCompleted = isCourseCompleted(previousCourse.id);
    
    // In a real app, you'd check the score of the previous course's quiz if it has one.
    // if (previousCourse.quiz) {
    //   const previousCourseScore = currentUser.courseScores?.find(s => s.courseId === previousCourse.id)?.score ?? 0;
    //   return isPreviousCourseCompleted && previousCourseScore >= 80;
    // }

    return isPreviousCourseCompleted;
  }

  return (
    <div className="container mx-auto py-2">
       <div className="mb-6">
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
                              const courseUnlocked = isCourseUnlocked(course, previousCourse);
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
