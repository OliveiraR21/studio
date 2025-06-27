import { CourseListClient } from "@/components/admin/course-list-client";
import { availableCourses } from "@/lib/data";

export default function AdminCoursesPage() {
  // In a real app, you would fetch this data from your database.
  const allCourses = availableCourses;

  return (
    <div className="container mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Cursos</h1>
            <p className="text-muted-foreground">
                Visualize e gerencie os cursos de treinamento disponíveis. Para adicionar, editar ou remover um curso, você precisa modificar o arquivo <code className="font-mono bg-muted p-1 rounded">src/lib/data.ts</code>.
            </p>
        </div>
        <CourseListClient courses={allCourses} />
    </div>
  );
}
