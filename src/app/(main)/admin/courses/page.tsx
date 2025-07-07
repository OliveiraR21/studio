import { CourseListClient } from "@/components/admin/course-list-client";
import { Button } from "@/components/ui/button";
import { getLearningModules } from "@/lib/data-access";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const learningModules = await getLearningModules();
  
  return (
    <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Gerenciamento de Cursos</h1>
              <p className="text-muted-foreground">
                  Visualize os cursos individuais. A estrutura de trilhas e módulos é gerenciada na tela de "Gerenciamento de Trilhas e Módulos".
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/courses/new/edit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Curso
              </Link>
            </Button>
        </div>
        <CourseListClient modules={learningModules} />
    </div>
  );
}
