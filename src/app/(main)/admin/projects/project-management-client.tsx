
'use client';

import { useState } from 'react';
import type { ProjectSubmission, SubmissionStatus } from '@/lib/types';
import { updateSubmissionStatus } from '@/actions/project-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Check, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProjectManagementClientProps {
  initialSubmissions: ProjectSubmission[];
}

const statusColors: Record<SubmissionStatus, string> = {
  Pendente: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
  Aprovado: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  Reprovado: 'bg-destructive/20 text-destructive dark:text-destructive border-destructive/30',
};

export function ProjectManagementClient({ initialSubmissions }: ProjectManagementClientProps) {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: SubmissionStatus) => {
    setIsUpdating(id);
    const result = await updateSubmissionStatus(id, status);
    if (result.success) {
      setSubmissions(subs => subs.map(s => s.id === id ? { ...s, status } : s));
      toast({ title: 'Sucesso!', description: result.message });
    } else {
      toast({ variant: 'destructive', title: 'Erro', description: result.message });
    }
    setIsUpdating(null);
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Colaborador</TableHead>
            <TableHead>Nome do Projeto</TableHead>
            <TableHead>Data da Inscrição</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length > 0 ? (
            submissions.map(submission => (
              <TableRow key={submission.id}>
                <TableCell>
                  <div className="font-medium">{submission.userName}</div>
                  <div className="text-sm text-muted-foreground">{submission.userEmail}</div>
                </TableCell>
                <TableCell className="font-medium">{submission.projectName}</TableCell>
                <TableCell>{format(submission.submissionDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={cn("font-semibold", statusColors[submission.status])}>
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {isUpdating === submission.id ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mudar Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateStatus(submission.id, 'Aprovado')}>
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          Aprovar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(submission.id, 'Reprovado')}>
                          <X className="mr-2 h-4 w-4 text-red-500" />
                          Reprovar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhuma candidatura de projeto encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
