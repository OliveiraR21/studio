"use client";

import type { User } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserManagementClientProps {
  users: User[];
}

export function UserManagementClient({ users }: UserManagementClientProps) {
  const managerRoles = ['Admin', 'Diretor', 'Gerente', 'Coordenador', 'Supervisor'];

  return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Coordenador</TableHead>
              <TableHead>Gerente</TableHead>
              <TableHead>Diretor</TableHead>
              <TableHead>Cursos Concluídos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={managerRoles.includes(user.role) ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.area || 'N/A'}</TableCell>
                <TableCell>{user.supervisor || 'N/A'}</TableCell>
                <TableCell>{user.coordenador || 'N/A'}</TableCell>
                <TableCell>{user.gerente || 'N/A'}</TableCell>
                <TableCell>{user.diretor || 'N/A'}</TableCell>
                <TableCell>{user.completedCourses.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
}
