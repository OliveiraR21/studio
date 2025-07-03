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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";


interface UserManagementClientProps {
  users: User[];
}

export function UserManagementClient({ users }: UserManagementClientProps) {
  const managerRoles = ['Admin', 'Diretor', 'Gerente', 'Coordenador', 'Supervisor'];
  const { toast } = useToast();

  const handleActionClick = () => {
    toast({
      variant: "destructive",
      title: "Funcionalidade em desenvolvimento",
      description: "A edição e exclusão de dados ainda não foram implementadas.",
    });
  };

  return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Gestor Direto</TableHead>
              <TableHead>Cursos Concluídos</TableHead>
              <TableHead className="w-[150px] text-right">Ações</TableHead>
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
                <TableCell>{user.supervisor || user.coordenador || user.gerente || user.diretor || 'N/A'}</TableCell>
                <TableCell>{user.completedCourses.length}</TableCell>
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
