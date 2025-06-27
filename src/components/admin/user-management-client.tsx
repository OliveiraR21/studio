"use client";

import type { User, Course } from "@/lib/types";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { suggestTrainingAssignments } from "@/ai/flows/suggest-training-assignments";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface UserManagementClientProps {
  users: User[];
  courses: Course[];
}

export function UserManagementClient({ users, courses }: UserManagementClientProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const managerRoles = ['Admin', 'Diretor', 'Gerente', 'Coordenador', 'Supervisor'];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Gestor Imediato</TableHead>
              <TableHead>Concluídos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
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
                <TableCell>{user.supervisor || user.coordenador || user.gerente || user.diretor || 'N/A'}</TableCell>
                <TableCell>{user.completedTraining.length} cursos</TableCell>
                <TableCell className="text-right">
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => {
                        setSelectedUser(user);
                    }}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Sugerir Treinamento
                    </Button>
                  </DialogTrigger>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <SuggestTrainingModal
        user={selectedUser}
        courses={courses}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </Dialog>
  );
}


interface SuggestTrainingModalProps {
    user: User | null;
    courses: Course[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

function SuggestTrainingModal({ user, courses, isOpen, setIsOpen }: SuggestTrainingModalProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<Course[]>([]);

    useEffect(() => {
        // Reset state when modal is closed
        if (!isOpen) {
            setSuggestions([]);
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleGetSuggestions = async () => {
        if (!user) return;
        setIsLoading(true);
        setSuggestions([]);

        try {
            const result = await suggestTrainingAssignments({
                userRole: user.role,
                completedTraining: user.completedTraining,
                availableTraining: courses.map(c => ({
                    id: c.id,
                    title: c.title,
                    description: c.description,
                    tags: c.tags || []
                })),
            });
            
            const suggestedCourses = courses.filter(c => result.suggestedTrainingIds.includes(c.id));
            setSuggestions(suggestedCourses);

            toast({
                title: "Sugestões geradas!",
                description: `Encontrados ${suggestedCourses.length} cursos relevantes para ${user.name}.`,
            });

        } catch (error) {
            console.error("AI suggestion failed:", error);
            toast({
                variant: "destructive",
                title: "Ocorreu um erro",
                description: "Falha ao gerar sugestões da IA. Por favor, tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Sugestões de Treinamento com IA</DialogTitle>
                <DialogDescription>
                    Gere atribuições de treinamento relevantes para {user?.name} com base em sua função e trabalho concluído.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                {!suggestions.length && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center gap-4 p-8 border-2 border-dashed rounded-lg">
                        <Wand2 className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Clique no botão abaixo para gerar sugestões baseadas em IA.</p>
                         <Button onClick={handleGetSuggestions}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Obter Sugestões da IA
                        </Button>
                    </div>
                )}
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4">Gerando sugestões...</p>
                    </div>
                )}
                {suggestions.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2">Cursos Sugeridos para {user?.name}:</h3>
                         <ScrollArea className="h-72 w-full rounded-md border p-2">
                            <div className="space-y-2">
                                {suggestions.map(course => (
                                    <div key={course.id} className="p-2 border rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{course.title}</p>
                                            <p className="text-sm text-muted-foreground">{course.description.substring(0,60)}...</p>
                                        </div>
                                        <Button size="sm" variant="ghost">Atribuir</Button>
                                    </div>
                                ))}
                            </div>
                         </ScrollArea>
                    </div>
                )}
            </div>
            <DialogFooter>
                {suggestions.length > 0 && !isLoading && (
                    <Button onClick={handleGetSuggestions} variant="outline" size="sm">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Gerar Novamente
                    </Button>
                )}
                 <Button variant="secondary" onClick={() => setIsOpen(false)}>Fechar</Button>
                 <Button>Atribuir Selecionados</Button>
            </DialogFooter>
        </DialogContent>
    )
}
