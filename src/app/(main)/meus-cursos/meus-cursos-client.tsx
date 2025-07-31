

'use client';

import type { Track, Course, User, Module } from "@/lib/types";
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
import { Lock, ClipboardList, BrainCircuit, HeartHandshake, Bot, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CourseCard } from "@/components/dashboard/course-card";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { TrackFinalActions } from "@/components/course/track-final-actions";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const moduleIcons: Record<string, React.ElementType> = {
    'module-integration': ClipboardList,
    'module-hs': BrainCircuit,
    'module-ss': HeartHandshake,
    'module-hms': Bot,
};

interface MyCoursesPageContentProps {
    learningModules: Module[];
    currentUser: User;
    nextCourse: (Course & { trackId: string; }) | null
}


export function MyCoursesPageContent({ learningModules, currentUser, nextCourse }: MyCoursesPageContentProps) {
  const searchParams = useSearchParams();

  const findTrackInModules = (modules: Module[], trackId: string): Track | undefined => {
    for (const module of modules) {
        const track = module.tracks.find(t => t.id === trackId);
        if (track) return track;
    }
    return undefined;
  };
  
  const openTrackId = searchParams.get('openTrack');
  const defaultOpenTrackId = openTrackId || nextCourse?.trackId;
  const defaultTrack = defaultOpenTrackId ? findTrackInModules(learningModules, defaultOpenTrackId) : undefined;
  const defaultOpenModuleId = defaultTrack?.moduleId || learningModules[0]?.id;

  
  return (
    <div className="container mx-auto py-2 space-y-8">
      <div className="mb-6">
          <h1 className="text-3xl font-bold">Meus Cursos</h1>
          <p className="text-muted-foreground">
              Explore suas trilhas de conhecimento e continue sua jornada de aprendizado.
          </p>
      </div>
      <Tabs defaultValue={defaultOpenModuleId}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-4 h-auto">
          {learningModules.map(module => {
            const Icon = moduleIcons[module.id] || ClipboardList; // Fallback icon
            return (
                <TabsTrigger key={module.id} value={module.id} className="h-full flex flex-col items-start p-4 text-left">
                <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <p className="font-bold text-lg">{module.title}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-normal mt-2">{module.description}</p>
                </TabsTrigger>
            );
          })}
        </TabsList>

        {learningModules.map(module => (
          <TabsContent key={module.id} value={module.id}>
             <TrackAccordion tracks={module.tracks} currentUser={currentUser} defaultOpenTrackId={defaultOpenTrackId} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}



const TrackAccordion = ({ 
    tracks, 
    currentUser, 
    defaultOpenTrackId 
}: { 
    tracks: Track[], 
    currentUser: User, 
    defaultOpenTrackId?: string 
}) => {
    const isCourseCompleted = (courseId: string) => currentUser.completedCourses.includes(courseId);

    const getTrackProgress = (track: Track): number | null => {
        if (track.courses.length === 0) return null;
        const completedCount = track.courses.filter(c => isCourseCompleted(c.id)).length;
        return (completedCount / track.courses.length) * 100;
    };
    
    const isTrackCompleted = (track: Track): boolean => {
        if (track.courses.length > 0) {
            return track.courses.every(c => isCourseCompleted(c.id));
        }
        if (track.quiz && track.quiz.questions.length > 0) {
             return currentUser.completedTracks.includes(track.id);
        }
        // An empty track is considered "complete" for prerequisite purposes
        return true;
    }

    return (
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={defaultOpenTrackId ? `track-${defaultOpenTrackId}` : undefined}>
            {tracks.map((track, trackIndex) => {
                let isUnlocked = true;
                if (trackIndex > 0) {
                    let prerequisiteTrack: Track | undefined;
                    for (let i = trackIndex - 1; i >= 0; i--) {
                        const pt = tracks[i];
                        // A track is a prerequisite if it has courses or a quiz. Empty tracks are skipped.
                        const isSkippable = pt.courses.length === 0 && (!pt.quiz || pt.quiz.questions.length === 0);
                        if (!isSkippable) {
                             prerequisiteTrack = pt;
                             break;
                        }
                    }
                    if (prerequisiteTrack) {
                        isUnlocked = isTrackCompleted(prerequisiteTrack);
                    }
                }
                const unlocked = isUnlocked;

                const progress = getTrackProgress(track);
                const allCoursesInTrackCompleted = progress === 100;
                const trackCompleted = currentUser.completedTracks.includes(track.id) || (allCoursesInTrackCompleted && track.courses.length > 0);
                const hasQuiz = track.quiz && track.quiz.questions.length > 0;
                
                return (
                    <Card key={track.id} className={!unlocked ? 'bg-muted/50' : ''}>
                        <AccordionItem value={`track-${track.id}`} className="border-b-0">
                            <AccordionTrigger className={`p-6 hover:no-underline ${!unlocked ? 'cursor-not-allowed' : ''}`} disabled={!unlocked}>
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                                        {trackCompleted ? (
                                            <CheckCircle className="h-8 w-8 text-green-500" />
                                        ) : unlocked ? (
                                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">{track.order || trackIndex + 1}</div>
                                        ) : (
                                            <Lock className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-grow text-left">
                                        <h3 className="text-xl font-semibold">{track.title}</h3>
                                        <p className="text-sm text-muted-foreground">{track.description}</p>
                                        {progress !== null && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Progress value={progress} className="w-full max-w-xs h-2" />
                                                <span className="text-xs font-semibold text-muted-foreground">{Math.round(progress)}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <div className="border-t pt-6">
                                    {track.courses.length > 0 && (
                                        <>
                                            <h4 className="text-md font-semibold mb-4">Cursos da Trilha</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                                {track.courses.map((course, courseIndex) => {
                                                    const previousCourse = courseIndex > 0 ? track.courses[courseIndex - 1] : undefined;
                                                    const courseUnlocked = unlocked && (!previousCourse || isCourseCompleted(previousCourse.id));
                                                    const completed = isCourseCompleted(course.id);
                                                    return (
                                                        <CourseCard 
                                                            key={course.id} 
                                                            course={course}
                                                            isUnlocked={courseUnlocked}
                                                            isCompleted={completed}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                    
                                    <Separator className="my-6" />

                                    <TrackFinalActions
                                        trackId={track.id}
                                        trackTitle={track.title}
                                        allCoursesInTrackCompleted={allCoursesInTrackCompleted}
                                        trackCompleted={trackCompleted}
                                        hasQuiz={hasQuiz}
                                        courseCount={track.courses.length}
                                        courses={track.courses}
                                        currentUser={currentUser}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Card>
                );
            })}
        </Accordion>
    );
};
