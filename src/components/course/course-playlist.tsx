
"use client";

import type { User, Module, Track, Course } from "@/lib/types";
import { userHasCourseAccess } from "@/lib/access-control";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Lock, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CoursePlaylistProps {
    allModules: Module[];
    currentUser: User;
    currentCourseId: string;
    currentTrackId: string;
}

export function CoursePlaylist({ allModules, currentUser, currentCourseId, currentTrackId }: CoursePlaylistProps) {
    
    // Filter modules and tracks based on user access, unless they are Admin or Diretor
    const learningModules = 
        (currentUser.role === 'Admin' || currentUser.role === 'Diretor')
        ? allModules
        : allModules.map(module => ({
            ...module,
            tracks: module.tracks
                .map(track => ({
                ...track,
                courses: track.courses.filter(course => userHasCourseAccess(currentUser, course))
                }))
                .filter(track => track.courses.length > 0) // Hide tracks with no accessible courses
            })).filter(module => module.tracks.length > 0); // Hide modules with no accessible tracks


    const isCourseCompleted = (courseId: string) => currentUser.completedCourses.includes(courseId);

    const isCourseUnlocked = (course: Course, track: Track, courseIndex: number) => {
        let isParentTrackUnlocked = true;
        
        // Find current module and track index
        const currentModule = allModules.find(m => m.tracks.some(t => t.id === track.id));
        if (!currentModule) return false;

        const trackIndex = currentModule.tracks.findIndex(t => t.id === track.id);
        
        if (trackIndex > 0) {
            let prerequisiteTrack: Track | undefined;
            for (let i = trackIndex - 1; i >= 0; i--) {
                const pt = currentModule.tracks[i];
                const isSkippable = pt.courses.length === 0 && (!pt.quiz || pt.quiz.questions.length === 0);
                if (!isSkippable) {
                    prerequisiteTrack = pt;
                    break;
                }
            }
            if (prerequisiteTrack) {
                isParentTrackUnlocked = currentUser.completedTracks.includes(prerequisiteTrack.id);
            }
        }
        
        if (!isParentTrackUnlocked) return false;

        const previousCourse = courseIndex > 0 ? track.courses[courseIndex - 1] : undefined;
        if (!previousCourse) return true; // First course in an unlocked track is always unlocked.
        
        return isCourseCompleted(previousCourse.id);
    }

    return (
        <Card>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-10rem)]">
                     <Accordion type="multiple" defaultValue={[`track-${currentTrackId}`]} className="w-full">
                        {learningModules.flatMap(module => module.tracks).map((track) => (
                            <AccordionItem value={`track-${track.id}`} key={track.id} className="border-x-0 border-t-0 px-3">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                    <div className="flex-1 text-left">
                                      <p>{track.title}</p>
                                      <p className="text-xs font-normal text-muted-foreground">{track.description}</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-1">
                                        {track.courses
                                            .filter(course => userHasCourseAccess(currentUser, course))
                                            .map((course, index) => {
                                                const unlocked = isCourseUnlocked(course, track, index);
                                                const completed = isCourseCompleted(course.id);
                                                const isCurrent = course.id === currentCourseId;

                                                const statusIcon = isCurrent ? <Play className="h-4 w-4 text-primary" /> :
                                                                  completed ? <CheckCircle className="h-4 w-4 text-green-500" /> :
                                                                  !unlocked ? <Lock className="h-4 w-4 text-muted-foreground/70" /> :
                                                                  <div className="h-4 w-4 flex items-center justify-center">
                                                                    <div className="h-2 w-2 rounded-full border border-muted-foreground"></div>
                                                                  </div>;

                                                return (
                                                    <Link
                                                        key={course.id}
                                                        href={unlocked ? `/courses/${course.id}` : '#'}
                                                        className={cn(
                                                            "flex items-start gap-3 p-2 rounded-md transition-colors",
                                                            unlocked && "hover:bg-muted/50",
                                                            !unlocked && "cursor-not-allowed opacity-60",
                                                            isCurrent && "bg-primary/10"
                                                        )}
                                                        aria-disabled={!unlocked}
                                                    >
                                                        <div className="flex-shrink-0 pt-1">{statusIcon}</div>
                                                        <div className="flex-1">
                                                            <p className={cn("text-sm font-medium leading-tight", isCurrent && "text-primary")}>
                                                                {course.title}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {Math.round((course.durationInSeconds || 0) / 60)} min
                                                            </p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                     </Accordion>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
