

import { findCourseById, getLearningModules, getUsers } from "@/lib/data-access";
import { CourseForm } from "@/components/admin/course-form";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, RefreshCw, Save, Wand2 } from "lucide-react";
import { QuizViewer } from "@/components/admin/quiz-viewer";
import type { Course, Module, User } from "@/lib/types";
import { QuizGeneratorSection } from "./quiz-generator-section";

// This is now a Server Component, which is more robust for data fetching.
export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const isNew = id === 'new';

  // Fetch all necessary data in parallel on the server.
  const [modules, allUsers, courseResult] = await Promise.all([
    getLearningModules(),
    getUsers(),
    isNew ? Promise.resolve(null) : findCourseById(id),
  ]);

  // If we are editing and the course doesn't exist, show a 404 page.
  // This is the crucial check to prevent the 'undefined' error.
  if (!isNew && !courseResult) {
    notFound();
  }
  
  const course = courseResult?.course;
  const initialModuleId = courseResult?.module?.id;
  const initialTrackId = courseResult?.track.id;
  
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
          <CourseForm 
            course={course || null} 
            modules={modules} 
            allUsers={allUsers}
            initialModuleId={initialModuleId}
            initialTrackId={initialTrackId}
          />
        </CardContent>
      </Card>

      {!isNew && course?.quiz && (
        <QuizViewer quiz={course.quiz} courseTitle={course!.title!} />
      )}

      {!isNew && course && (
        <QuizGeneratorSection course={course} />
      )}
    </div>
  );
}
