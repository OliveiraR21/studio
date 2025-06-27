"use client";

import type { Course } from "@/lib/types";
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

interface CourseListClientProps {
  courses: Course[];
}

export function CourseListClient({ courses }: CourseListClientProps) {
  // NOTE: Add, Edit and Delete functionality is not implemented
  // as the data is static. This component is for display purposes.
  // In a real app, these buttons would trigger modals/forms to modify the data.

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Áreas de Acesso</TableHead>
            <TableHead>Cargos de Acesso</TableHead>
            <TableHead className="w-[150px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">
                <Link href={`/courses/${course.id}`} className="hover:underline">
                  {course.title}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {course.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                 <div className="flex flex-wrap gap-1">
                  {course.accessAreas && course.accessAreas.length > 0 ? (
                    course.accessAreas.map((area) => (
                      <Badge key={area} variant="outline">
                        {area}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">Todos</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                 <div className="flex flex-wrap gap-1">
                  {course.accessRoles && course.accessRoles.length > 0 ? (
                    course.accessRoles.map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))
                   ) : (
                    <Badge variant="outline">Todos</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                 <Button variant="ghost" size="icon" disabled>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                </Button>
                <Button variant="ghost" size="icon" disabled>
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
