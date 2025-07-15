
"use client";

import type { Module, Track } from "@/lib/types";
import { useState, useActionState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FileText, PlusCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveTrack } from "@/actions/track-actions";
import { useFormStatus } from "react-dom";

interface TrackManagementClientProps {
    modules: Module[];
}

interface EditTrackDialogProps {
    track: Track;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Salvar Alterações
    </Button>
  );
}

function EditTrackDialog({ track, open, onOpenChange }: EditTrackDialogProps) {
    const { toast } = useToast();
    const initialState = { message: '', errors: {}, success: false };
    const [state, dispatch] = useActionState(saveTrack, initialState);

    useEffect(() => {
        if (state.success) {
            toast({ title: 'Sucesso!', description: state.message });
            onOpenChange(false); // Close dialog on success
        } else if (state.message && state.errors && Object.keys(state.errors).length > 0) {
            // Toast for validation errors is now optional as they appear in the form.
            // You can re-enable this if you want both.
        }
         else if (state.message) {
            toast({ variant: 'destructive', title: 'Erro', description: state.message });
        }
    }, [state, toast, onOpenChange]);

    // This key is used to reset the form state when a new track is selected for editing
    const formKey = track ? track.id : 'new-track';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Editar Trilha</DialogTitle>
                    <DialogDescription>
                        Altere os detalhes da trilha e a sua ordem de exibição no módulo.
                    </DialogDescription>
                </DialogHeader>
                 <form key={formKey} action={dispatch} className="space-y-4 py-4">
                    <input type="hidden" name="id" value={track.id} />
                    <input type="hidden" name="moduleId" value={track.moduleId} />
                    
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" name="title" required defaultValue={track.title} />
                        {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" name="description" required defaultValue={track.description} />
                        {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="order">Ordem</Label>
                        <Input id="order" name="order" type="number" defaultValue={track.order} />
                        {state?.errors?.order && <p className="text-sm text-destructive">{state.errors.order[0]}</p>}
                    </div>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


export function TrackManagementClient({ modules }: TrackManagementClientProps) {
  const { toast } = useToast();
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  const handleEditClick = (track: Track) => {
    setEditingTrack(track);
  };

  const handleNewModuleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");
    console.log("New Module Data:", { title, description });
    toast({
      title: "Módulo (simulado) criado!",
      description: "Esta funcionalidade ainda está em desenvolvimento. O módulo não foi salvo permanentemente.",
    });
    setIsModuleDialogOpen(false);
  };

  const handleNewTrackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");
    const moduleId = formData.get("moduleId");
    console.log("New Track Data:", { title, description, moduleId });
    toast({
      title: "Trilha (simulada) criada!",
      description: "Esta funcionalidade ainda está em desenvolvimento. A trilha não foi salva permanentemente.",
    });
    setIsTrackDialogOpen(false);
  };
  
  const handleActionClick = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de dados ainda não foi implementada.",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Trilhas e Módulos</h1>
            <p className="text-muted-foreground">
                Visualize e gerencie a estrutura de aprendizagem.
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Módulo
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Criar Novo Módulo</DialogTitle>
                        <DialogDescription>
                            Módulos são as categorias de alto nível para organizar suas trilhas de aprendizagem.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleNewModuleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Título</Label>
                            <Input id="title" name="title" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Descrição</Label>
                            <Textarea id="description" name="description" className="col-span-3" required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Criar Módulo</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isTrackDialogOpen} onOpenChange={setIsTrackDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Trilha
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Criar Nova Trilha</DialogTitle>
                        <DialogDescription>
                            Trilhas são os caminhos de aprendizagem que contêm os cursos.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleNewTrackSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="moduleId" className="text-right">Módulo</Label>
                            <Select name="moduleId" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione um módulo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modules.map(module => (
                                        <SelectItem key={module.id} value={module.id}>{module.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Título</Label>
                            <Input id="title" name="title" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Descrição</Label>
                            <Textarea id="description" name="description" className="col-span-3" required />
                        </div>
                         <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Criar Trilha</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
          </div>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Estrutura de Aprendizagem</CardTitle>
              <CardDescription>
                  Módulos são as categorias de alto nível e Trilhas são os caminhos de aprendizagem dentro de cada módulo.
              </CardDescription>
          </CardHeader>
          <CardContent>
               <Accordion type="multiple" className="w-full space-y-4">
                  {modules.map((module: Module) => (
                      <AccordionItem value={module.id} key={module.id} className="border rounded-lg">
                          <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
                             <div className="text-left">
                                  <div>{module.title}</div>
                                  <p className="text-sm font-normal text-muted-foreground mt-1">{module.description}</p>
                             </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                              <div className="rounded-md border">
                                  <Table>
                                      <TableHeader>
                                          <TableRow>
                                              <TableHead className="w-12">Ordem</TableHead>
                                              <TableHead>Título da Trilha</TableHead>
                                              <TableHead>Nº de Cursos</TableHead>
                                              <TableHead>Prova Final</TableHead>
                                              <TableHead className="w-[150px] text-right">Ações</TableHead>
                                          </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                          {module.tracks.sort((a,b) => (a.order || Infinity) - (b.order || Infinity)).map(track => (
                                              <TableRow key={track.id}>
                                                  <TableCell className="text-center font-mono text-muted-foreground">{track.order || '-'}</TableCell>
                                                  <TableCell className="font-medium">{track.title}</TableCell>
                                                  <TableCell>{track.courses.length}</TableCell>
                                                  <TableCell>
                                                      {track.quiz && track.quiz.questions.length > 0 ? (
                                                          <Dialog>
                                                          <DialogTrigger asChild>
                                                              <Button variant="outline" size="sm">
                                                              <FileText className="mr-2 h-4 w-4" />
                                                              Visualizar
                                                              </Button>
                                                          </DialogTrigger>
                                                          <DialogContent className="sm:max-w-[625px]">
                                                              <DialogHeader>
                                                              <DialogTitle>Prova Final: {track.title}</DialogTitle>
                                                              <DialogDescription>
                                                                  Perguntas e respostas da prova final da trilha. A resposta correta está em destaque.
                                                              </DialogDescription>
                                                              </DialogHeader>
                                                              <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
                                                                  <div className="grid gap-6 py-4">
                                                                  {track.quiz.questions.map((q, index) => (
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
                                                  <TableCell className="text-right">
                                                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(track)}>
                                                          <Edit className="h-4 w-4" />
                                                          <span className="sr-only">Editar Trilha</span>
                                                      </Button>
                                                      <Button variant="ghost" size="icon" onClick={handleActionClick}>
                                                          <Trash2 className="h-4 w-4" />
                                                          <span className="sr-only">Excluir Trilha</span>
                                                      </Button>
                                                  </TableCell>
                                              </TableRow>
                                          ))}
                                          {module.tracks.length === 0 && (
                                              <TableRow>
                                                  <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                                                      Nenhuma trilha neste módulo.
                                                  </TableCell>
                                              </TableRow>
                                          )}
                                      </TableBody>
                                  </Table>
                              </div>
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
          </CardContent>
      </Card>
      
      {editingTrack && (
        <EditTrackDialog
            track={editingTrack}
            open={!!editingTrack}
            onOpenChange={(open) => {
                if (!open) {
                    setEditingTrack(null);
                }
            }}
        />
      )}
    </>
  );
}
