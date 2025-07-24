
"use client";

import type { Course, Quiz } from "@/lib/types";
import { useTransition, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, Trash2, FileText, ThumbsUp, Loader2, ThumbsDown, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { deleteCourseAction } from "@/actions/course-actions";
import type { Module } from "@/lib/types";
import { QuizGenerator } from "./quiz-generator";


interface CourseListClientProps {
    modules: Module[];
}

// Componente interno para a célula do Questionário, para manter o código limpo.
function QuizCell({ course }: { course: Course & { trackTitle: string } }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    // Se já existe um quiz, mostra um botão para visualizá-lo.
    if (course.quiz) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Visualizar
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Questionário: {course.title}</DialogTitle>
                        <DialogDescription>
                            Perguntas e respostas cadastradas. A resposta correta está em destaque.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
                        <div className="grid gap-6 py-4">
                            {course.quiz.questions.map((q, index) => (
                                <div key={index} className="space-y-2">
                                    <p className="font-semibold">
                                        {index + 1}. {q.text}
                                    </p>
                                    <ul className="space-y-1 text-sm">
                                        {q.options.map((opt, optIndex) => (
                                            <li
                                                key={optIndex}
                                                className={cn(
                                                    'p-1 rounded',
                                                    opt === q.correctAnswer
                                                        ? "font-bold text-green-700 dark:text-green-400"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                - {opt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
    
    // Se não existe um quiz, mostra um botão para gerá-lo.
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" size="sm" className="text-muted-foreground">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Gerar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Gerador de Questionário com IA</DialogTitle>
                    <DialogDescription>
                        A IA irá gerar um questionário com base no título, descrição e transcrição do curso.
                    </DialogDescription>
                </DialogHeader>
                 <QuizGenerator 
                    courseId={course.id}
                    title={course.title}
                    description={course.description}
                    hasExistingQuiz={!!course.quiz}
                    transcript={course.transcript}
                />
            </DialogContent>
        </Dialog>
    );
}


export function CourseListClient({ modules }: CourseListClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const allCourses: (Course & { trackTitle: string })[] = [];
  modules.forEach(module => {
    module.tracks.forEach(track => {
        track.courses.forEach(course => {
            allCourses.push({ ...course, trackTitle: track.title });
        });
    });
  });

  const handleDelete = (courseId: string) => {
    startTransition(async () => {
      const result = await deleteCourseAction(courseId);
      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Ordem</TableHead>
            <TableHead>Título do Curso</TableHead>
            <TableHead>Trilha</TableHead>
            <TableHead>Cargos</TableHead>
            <TableHead>Áreas</TableHead>
            <TableHead>Questionário</TableHead>
            <TableHead>Avaliações</TableHead>
            <TableHead className="w-[150px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCourses.sort((a,b) => (a.order || Infinity) - (b.order || Infinity)).map((course) => {
            const totalVotes = (course.likes || 0) + (course.dislikes || 0);

            return (
              <TableRow key={course.id}>
                <TableCell className="text-center font-mono text-muted-foreground">{course.order || '-'}</TableCell>
                <TableCell className="font-medium">
                  <Link href={`/courses/${course.id}`} className="hover:underline">
                    {course.title}
                  </Link>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{course.trackTitle}</Badge>
                </TableCell>
                <TableCell>
                  {course.minimumRole ? (
                    <Badge variant="outline">{course.minimumRole}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Todos</span>
                  )}
                </TableCell>
                <TableCell>
                   {course.accessAreas && course.accessAreas.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                          {course.accessAreas.map(area => (
                              <Badge key={area} variant="outline">{area}</Badge>
                          ))}
                      </div>
                  ) : (
                        <span className="text-xs text-muted-foreground">Todas</span>
                  )}
                </TableCell>
                <TableCell>
                   <QuizCell course={course} />
                </TableCell>
                <TableCell>
                  {totalVotes > 0 ? (
                      <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            <span className="font-semibold">{course.likes || 0}</span>
                          </div>
                           <div className="flex items-center gap-1.5">
                            <ThumbsDown className="h-4 w-4 text-destructive" />
                            <span className="font-semibold">{course.dislikes || 0}</span>
                          </div>
                      </div>
                  ) : (
                      <span className="text-xs text-muted-foreground">Nenhuma</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/courses/${course.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                        </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isPending}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Essa ação não pode ser desfeita. Isso excluirá permanentemente o curso "{course.title}" e removerá seus dados de nossos servidores.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(course.id)} disabled={isPending}>
                                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Sim, excluir curso
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
