"use client";

import type { Module } from "@/lib/types";
import { learningModules } from "@/lib/data";
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
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function TrackManagementClient() {
  const { toast } = useToast();

  const handleActionClick = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição e exclusão de dados ainda não foram implementadas.",
    });
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Estrutura de Aprendizagem</CardTitle>
            <CardDescription>
                Módulos são as categorias de alto nível e Trilhas são os caminhos de aprendizagem dentro de cada módulo.
            </CardDescription>
        </CardHeader>
        <CardContent>
             <Accordion type="multiple" className="w-full space-y-4">
                {learningModules.map((module: Module) => (
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
                                            <TableHead>Título da Trilha</TableHead>
                                            <TableHead>Nº de Cursos</TableHead>
                                            <TableHead className="w-[150px] text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {module.tracks.map(track => (
                                            <TableRow key={track.id}>
                                                <TableCell className="font-medium">{track.title}</TableCell>
                                                <TableCell>{track.courses.length}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={handleActionClick}>
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
                                                <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
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
  );
}
