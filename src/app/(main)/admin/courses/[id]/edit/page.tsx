

'use client';

import { useState, useEffect, useCallback, use } from "react";
import { findCourseById, getLearningModules, getUsers } from "@/lib/data-access";
import { CourseForm } from "@/components/admin/course-form";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuizGenerator } from "@/components/admin/quiz-generator";
import type { Course, Module, User } from "@/lib/types";
import { QuizViewer } from "@/components/admin/quiz-viewer";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseData {
    course: Course | null;
    module: Module | null;
    trackId: string | null;
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to hold the transcript fetched from YouTube in CourseForm
  const [liveTranscript, setLiveTranscript] = useState<string | undefined>(undefined);

  const handleYouTubeDataFetched = useCallback((transcript: string) => {
    setLiveTranscript(transcript);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [modulesData, usersData] = await Promise.all([
          getLearningModules(),
          getUsers()
        ]);
        setModules(modulesData);
        setAllUsers(usersData);

        if (!isNew) {
          const result = await findCourseById(id);
          if (!result) {
            notFound();
          }
          setCourseData({
              course: result.course,
              module: result.module,
              trackId: result.track.id
          });
          setLiveTranscript(result.course.transcript); // Initialize with saved transcript
        } else {
          setCourseData({ course: null, module: null, trackId: null });
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        // Handle error state appropriately
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, isNew]);

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const course = courseData?.course;

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
            course={course} 
            modules={modules} 
            allUsers={allUsers}
            initialModuleId={courseData?.module?.id}
            initialTrackId={courseData?.trackId}
            onYouTubeDataFetched={handleYouTubeDataFetched}
          />
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
            transcript={liveTranscript ?? course.transcript}
        />
      )}
    </div>
  );
}
