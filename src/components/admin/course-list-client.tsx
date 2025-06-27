"use client";

import type { Track, Course } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { learningModules } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

// This component is simplified to just list all available courses.
// The complex logic of tracks and modules is handled on the dashboard.
export function CourseListClient() {
  const { toast } = useToast();
  const allCourses: (Course & { trackTitle: string })[] = [];
  learningModules.forEach(module => {
    module.tracks.forEach(track => {
        track.courses.forEach(course => {
            allCourses.push({ ...course, trackTitle: track.title });
        });
    });
  });

  const handleActionClick = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição e exclusão de dados ainda não foram implementadas.",
    });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título do Curso</TableHead>
            <TableHead>Trilha</TableHead>
            <TableHead>Possui Prova?</TableHead>
            <TableHead className="w-[150px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCourses.map((course) => (
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
                    <Badge variant="default">Sim</Badge>
                  ) : (
                    <Badge variant="outline">Não</Badge>
                  )}
               </TableCell>
              <TableCell className="text-right">
                 <Button variant="ghost" size="icon" onClick={handleActionClick}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleActionClick}>
                    <Trash2 className="h-4 w-4" />
                     <span className="sr-only">Excluir</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
