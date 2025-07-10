import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/types";
import { Lock, Play } from "lucide-react";
import { AnimatedCheckmark } from "../ui/animated-checkmark";

interface CourseCardProps {
  course: Course;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export function CourseCard({ course, isUnlocked, isCompleted }: CourseCardProps) {
  const CardContentComponent = (
    <Card 
      className={`overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group ${!isUnlocked ? 'bg-muted/60' : 'hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50'}`}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-40 overflow-hidden">
          {/* Light mode logo */}
          <img
            src="/BrSupply.png"
            alt={course.title}
            className={`w-full h-full object-contain p-4 transition-transform duration-300 ease-in-out block dark:hidden ${isUnlocked ? 'group-hover:scale-105' : ''} ${!isUnlocked ? 'grayscale' : ''}`}
            data-ai-hint="course thumbnail"
          />
          {/* Dark mode logo */}
          <img
            src="/br-supply-logo.png"
            alt={course.title}
            className={`w-full h-full object-contain p-4 transition-transform duration-300 ease-in-out hidden dark:block ${isUnlocked ? 'group-hover:scale-105' : ''} ${!isUnlocked ? 'grayscale' : ''}`}
            data-ai-hint="course thumbnail"
          />
          {!isUnlocked && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Lock className="h-10 w-10 text-white" />
            </div>
          )}
          {isCompleted && (
             <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full shadow-lg">
                <AnimatedCheckmark size={28} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className={`text-lg leading-tight mb-2 ${isUnlocked ? 'group-hover:text-primary' : 'text-muted-foreground'} transition-colors`}>
          {course.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {course.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <div className="flex justify-between items-center w-full">
            {course.quiz ? <Badge variant="outline">Prova</Badge> : <div />}
            {isUnlocked ? (
                 <span className="text-xs font-semibold text-primary flex items-center gap-1">
                    <Play className="h-3 w-3"/>
                    {isCompleted ? 'Revisar conteúdo' : 'Iniciar curso'}
                 </span>
            ) : (
                 <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3"/>
                    Bloqueado
                 </span>
            )}
         </div>
      </CardFooter>
    </Card>
  );
  
  if (isUnlocked) {
    return (
        <Link href={`/courses/${course.id}`} className="h-full">
            {CardContentComponent}
        </Link>
    )
  }

  return CardContentComponent;
}
