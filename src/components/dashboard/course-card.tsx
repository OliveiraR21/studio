import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
}

// NOTE: This component is currently unused after the dashboard refactor,
// but is kept for potential future use on different pages.

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/50">
        <CardHeader className="p-0">
          <div className="relative w-full h-40 overflow-hidden">
             <Image
                src={"https://placehold.co/600x400.png"}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint="course thumbnail"
              />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
