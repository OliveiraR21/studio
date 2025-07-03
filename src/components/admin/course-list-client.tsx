"use client";

import type { Course, Module } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Edit, Trash2, FileText, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CourseListClientProps {
    modules: Module[];
}

export function CourseListClient({ modules }: CourseListClientProps) {
  const { toast } = useToast();
  
  const allCourses: (Course & { trackTitle: string })[] = [];
  modules.forEach(module => {
    module.tracks.forEach(track => {
        track.courses.forEach(course => {
            allCourses.push({ ...course, trackTitle: track.title });
        });
    });
  });

  const handleDeleteClick = () => {
    toast({
      variant: "destructive",
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de dados ainda não foi implementada.",
    });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título do Curso</TableHead>
            <TableHead>Trilha</TableHead>
            <TableHead>Questionário</TableHead>
            <TableHead>Avaliação Média</TableHead>
            <TableHead className="w-[150px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCourses.map((course) => {
            const totalVotes = (course.likes || 0) + (course.dislikes || 0);
            const satisfaction = totalVotes > 0 ? Math.round(((course.likes || 0) / totalVotes) * 100) : null;

            return (
              <TableRow key={course.id}>
                <TableCell className="font-medium">
                  <Link href={`/courses/${course.id}`} className="hover:underline">
                    {course.title}
                  </Link>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{course.trackTitle}</Badge>
                </TableCell>
                <TableCell>
                    {course.quiz ? (
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
                    ) : (
                      <Badge variant="outline">Não possui</Badge>
                    )}
                </TableCell>
                <TableCell>
                  {satisfaction !== null ? (
                      <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">{satisfaction}%</span>
                          <span className="text-xs text-muted-foreground">({totalVotes} votos)</span>
                      </div>
                  ) : (
                      <span className="text-xs text-muted-foreground">Nenhuma avaliação</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/courses/${course.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                      </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleDeleteClick}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
