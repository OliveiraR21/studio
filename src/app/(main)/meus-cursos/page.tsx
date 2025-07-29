

import { getLearningModules, findNextCourseForUser } from "@/lib/data-access";
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
import type { Track, Course, User, Module } from "@/lib/types";
import { CourseCard } from "@/components/dashboard/course-card";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { UserNotFound } from "@/components/layout/user-not-found";
import { TrackFinalActions } from "@/components/course/track-final-actions";
import { getCurrentUser } from "@/lib/auth";
import { userHasCourseAccess } from "@/lib/access-control";
import React from "react";

const PASSING_SCORE = 90;

const moduleIcons: Record<string, React.ElementType> = {
    'module-integration': ClipboardList,
    'module-hs': BrainCircuit,
    'module-ss': HeartHandshake,
    'module-hms': Bot,
};

const flattenTracks = (tracks: Track[]): Track[] => {
    let allTracks: Track[] = [];
    for (const track of tracks) {
        allTracks.push(track);
        if (track.subTracks) {
            allTracks = allTracks.concat(flattenTracks(track.subTracks));
        }
    }
    return allTracks;
};

// Recursive component to render tracks and sub-tracks
const TrackAccordion = ({ 
    tracks, 
    currentUser, 
    level = 0, 
    defaultOpenTrackId, 
    parentTrackUnlocked = true 
}: { 
    tracks: Track[], 
    currentUser: User, 
    level?: number, 
    defaultOpenTrackId?: string, 
    parentTrackUnlocked?: boolean 
}) => {
    const isCourseCompleted = (courseId: string) => currentUser.completedCourses.includes(courseId);

    const getTrackProgress = (track: Track): number | null => {
        const courses = track.subTracks ? flattenTracks(track.subTracks).flatMap(t => t.courses) : track.courses;
        if (courses.length === 0) return null;
        const completedCount = courses.filter(c => isCourseCompleted(c.id)).length;
        return (completedCount / courses.length) * 100;
    };
    
    const isTrackCompleted = (track: Track): boolean => {
        if (track.subTracks && track.subTracks.length > 0) {
            return track.subTracks.every(st => isTrackCompleted(st));
        }
        if (track.courses.length > 0) {
            return track.courses.every(c => isCourseCompleted(c.id));
        }
        if (track.quiz && track.quiz.questions.length > 0) {
             return currentUser.completedTracks.includes(track.id);
        }
        // An empty track is considered "complete" for prerequisite purposes
        return true;
    }

    const isCourseUnlocked = (course: Course, track: Track, courseIndex: number) => {
        const isParentUnlocked = currentUser.completedTracks.includes(track.id) || parentTrackUnlocked;
        if (!isParentUnlocked) return false;
        
        if (courseIndex === 0) return true;
        
        const previousCourse = track.courses[courseIndex - 1];
        return isCourseCompleted(previousCourse.id);
    };

    return (
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={defaultOpenTrackId ? `track-${defaultOpenTrackId}` : undefined}>
            {tracks.sort((a,b) => (a.order || Infinity) - (b.order || Infinity)).map((track, trackIndex) => {
                let isUnlocked = parentTrackUnlocked;
                if (trackIndex > 0) {
                    let prerequisiteTrack: Track | undefined;
                    for (let i = trackIndex - 1; i >= 0; i--) {
                        const pt = tracks[i];
                        if (!prerequisiteTrack) {
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
                const trackCompleted = currentUser.completedTracks.includes(track.id) || isTrackCompleted(track);
                const hasQuiz = track.quiz && track.quiz.questions.length > 0;
                
                return (
                    <Card key={track.id} className={cn(!unlocked ? 'bg-muted/50' : '', level > 0 && 'ml-6')}>
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
                                    {track.subTracks && track.subTracks.length > 0 && (
                                        <TrackAccordion tracks={track.subTracks} currentUser={currentUser} level={level + 1} defaultOpenTrackId={defaultOpenTrackId} parentTrackUnlocked={unlocked && trackCompleted}/>
                                    )}

                                    {track.courses.length > 0 && (
                                        <>
                                            <h4 className="text-md font-semibold mb-4">Cursos da Trilha</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                                {track.courses.map((course, courseIndex) => {
                                                    const courseUnlocked = isCourseUnlocked(course, track, courseIndex);
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


export default async function MyCoursesPage({
  searchParams,
}: {
  searchParams?: { openTrack?: string };
}) {
  const currentUser = await getCurrentUser();
  const allModules = await getLearningModules();

  if (!currentUser) {
    return <UserNotFound />
  }

  // Filter modules and tracks based on user access.
  const learningModules = allModules.map(module => ({
      ...module,
      tracks: module.tracks
        .map(track => {
            const filterCourses = (courses: Course[]) => courses.filter(course => userHasCourseAccess(currentUser, course)).sort((a,b) => (a.order ?? Infinity) - (b.order ?? Infinity));
            
            const filterSubTracks = (tracks: Track[]): Track[] => {
                return tracks.map(st => ({
                    ...st,
                    courses: filterCourses(st.courses),
                    subTracks: st.subTracks ? filterSubTracks(st.subTracks) : []
                })).filter(st => st.courses.length > 0 || (st.subTracks && st.subTracks.length > 0));
            };

            return {
                ...track,
                courses: filterCourses(track.courses),
                subTracks: track.subTracks ? filterSubTracks(track.subTracks) : []
            };
        })
        .filter(track => (currentUser.role === 'Admin' || currentUser.role === 'Diretor') ? true : (track.courses.length > 0 || (track.subTracks && track.subTracks.length > 0)))
        .sort((a, b) => (a.order || Infinity) - (b.order || Infinity)) 
    })).filter(module => module.tracks.length > 0);


  const nextCourse = await findNextCourseForUser(currentUser);
  
  const findTrackInModules = (modules: Module[], trackId: string): Track | undefined => {
    for (const module of modules) {
        const found = flattenTracks(module.tracks).find(t => t.id === trackId);
        if (found) return found;
    }
    return undefined;
  };

  const defaultOpenTrackId = searchParams?.openTrack || nextCourse?.trackId;
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
