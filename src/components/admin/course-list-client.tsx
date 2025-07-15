
"use client";

import type { Course, CourseVersion } from "@/lib/types";
import { useTransition } from "react";
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
import { Edit, Trash2, FileText, ThumbsUp, Loader2, ThumbsDown, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { deleteCourseAction } from "@/actions/course-actions";
import type { Module } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CourseListClientProps {
    modules: Module[];
}

const formatSecondsToHHMMSS = (totalSeconds: number | undefined) => {
  if (totalSeconds === undefined || totalSeconds === null || totalSeconds < 0 || isNaN(totalSeconds))
    return 'N/A';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};


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
            <TableHead>Título do Curso</TableHead>
            <TableHead>Trilha</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Versão</TableHead>
            <TableHead>Questionário</TableHead>
            <TableHead>Avaliações</TableHead>
            <TableHead className="w-[200px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCourses.sort((a,b) => a.order - b.order).map((course) => {
            const totalVotes = (course.likes || 0) + (course.dislikes || 0);
            const currentVersion = course.versions.find(v => v.version === course.currentVersion);

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
                  <Badge variant="outline">{course.order}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>v{course.currentVersion}</Badge>
                </TableCell>
                <TableCell>
                    {currentVersion?.quiz ? (
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
                              {currentVersion.quiz.questions.map((q, index) => (
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <History className="h-4 w-4" />
                                <span className="sr-only">Histórico</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>Histórico de Versões: {course.title}</DialogTitle>
                                <DialogDescription>
                                    Visualize todas as versões do curso. A versão atual está destacada.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
                                <div className="space-y-4">
                                    {course.versions.sort((a,b) => b.version - a.version).map((version: CourseVersion) => (
                                        <div key={version.version} className={cn("p-4 rounded-lg border", version.version === course.currentVersion && "bg-muted/50 border-primary/50")}>
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold">Versão {version.version}</h4>
                                                <p className="text-xs text-muted-foreground">{format(version.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                                            </div>
                                            <p className="text-sm"><strong>URL:</strong> <span className="text-muted-foreground break-all">{version.videoUrl}</span></p>
                                            <p className="text-sm"><strong>Duração:</strong> <span className="text-muted-foreground">{formatSecondsToHHMMSS(version.durationInSeconds)}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
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
