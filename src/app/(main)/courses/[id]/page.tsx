import { CoursePlayer } from "@/components/course/course-player";
import { Quiz } from "@/components/course/quiz";
import { availableCourses } from "@/lib/data";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = availableCourses.find((c) => c.id === params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CoursePlayer videoUrl={course.videoUrl} title={course.title} />
          <div className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <div className="flex items-center gap-2 mt-2 mb-4">
              {course.tags?.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
        </div>
        <div className="lg:col-span-1">
            <div className="sticky top-6">
                <h2 className="text-2xl font-semibold mb-4">Course Quiz</h2>
                <Separator className="mb-4" />
                <Quiz quiz={course.quiz} />
            </div>
        </div>
      </div>
    </div>
  );
}
