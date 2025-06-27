import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const isEmbed = course.thumbnailUrl.includes('embed');

  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/50">
        <CardHeader className="p-0">
          <div className="relative w-full h-40 overflow-hidden">
            {isEmbed ? (
               <iframe
                src={course.thumbnailUrl}
                title={`Capa para ${course.title}`}
                className="w-full h-full border-0 transition-transform duration-300 ease-in-out group-hover:scale-105"
                loading="lazy"
                allowFullScreen={false}
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            ) : (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint="course thumbnail"
              />
            )}
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
        <CardFooter className="p-4 pt-0">
            {course.tags && course.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="mr-2">{tag}</Badge>
            ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
