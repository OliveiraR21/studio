import { CourseListClient } from "@/components/admin/course-list-client";

export default function AdminCoursesPage() {
  return (
    <div className="container mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Cursos</h1>
            <p className="text-muted-foreground">
                Visualize os cursos individuais. A estrutura de trilhas e módulos é gerenciada na tela de "Gerenciamento de Trilhas e Módulos".
            </p>
        </div>
        <CourseListClient />
    </div>
  );
}
