

import { findCourseById, getLearningModules, getUsers } from "@/lib/data-access";
import { CourseForm } from "@/components/admin/course-form";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuizGenerator } from "@/components/admin/quiz-generator";
import type { Course } from "@/lib/types";
import { QuizViewer } from "@/components/admin/quiz-viewer";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let course: Course | null = null;
  const modules = await getLearningModules();
  const allUsers = await getUsers();

  if (!isNew) {
    const result = await findCourseById(params.id);
    if (!result) {
      notFound();
    }
    course = result.course;
  }
  
  return (
    <div className="container mx-auto space-y-6">
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
          <CourseForm course={course} modules={modules} allUsers={allUsers} />
        </CardContent>
      </Card>

      {!isNew && course?.quiz && (
        <QuizViewer quiz={course.quiz} courseTitle={course!.title!} />
      )}

      {!isNew && course && (
        <QuizGenerator 
            courseId={course.id}
            title={course.title}
            description={course.description}
            hasExistingQuiz={!!course.quiz}
            transcript={course.transcript}
        />
      )}
    </div>
  );
}
