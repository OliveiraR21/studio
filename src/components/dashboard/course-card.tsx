import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/types";
import { CheckCircle, Lock, Play } from "lucide-react";

interface CourseCardProps {
  course: Course;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export function CourseCard({ course, isUnlocked, isCompleted }: CourseCardProps) {
  return (
    <Card 
      className={`overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group ${!isUnlocked ? 'bg-muted/60' : 'hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50'}`}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-40 overflow-hidden">
          <Image
            src={"https://placehold.co/600x400.png"}
            alt={course.title}
            fill
            className={`object-cover transition-transform duration-300 ease-in-out ${isUnlocked ? 'group-hover:scale-105' : ''} ${!isUnlocked ? 'grayscale' : ''}`}
            data-ai-hint="course thumbnail"
          />
          {!isUnlocked && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Lock className="h-10 w-10 text-white" />
            </div>
          )}
          {isCompleted && (
             <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
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
            <Button size="sm" asChild disabled={!isUnlocked}>
                <Link href={`/courses/${course.id}`}>
                    <Play className="mr-2 h-4 w-4"/>
                    {isCompleted ? 'Revisar' : 'Iniciar'}
                </Link>
            </Button>
         </div>
      </CardFooter>
    </Card>
  );
}
