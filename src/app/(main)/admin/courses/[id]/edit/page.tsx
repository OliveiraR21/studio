import { findCourseById } from "@/lib/data-access";
import { CourseForm } from "@/components/admin/course-form";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let course = null;

  if (!isNew) {
    course = await findCourseById(params.id);
    if (!course) {
      notFound();
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild>
            <Link href="/admin/courses">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Gerenciamento de Cursos
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Criar Novo Curso' : 'Editar Curso'}</CardTitle>
          <CardDescription>
            {isNew 
              ? 'Preencha os detalhes abaixo para adicionar um novo curso à plataforma.' 
              : `Você está editando o curso: "${course?.title}".`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm course={course} />
        </CardContent>
      </Card>
    </div>
  );
}
