
"use client";

import { useState, useMemo, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Presentation, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { submitProjectProposal } from "@/actions/project-actions";
import { findProjectSubmissionByUserId } from "@/lib/data-access";
import type { User, Module, ProjectSubmission } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ProjectSubmissionCardProps {
  allModules: Module[];
  currentUser: User;
}

export function ProjectSubmissionCard({ allModules, currentUser }: ProjectSubmissionCardProps) {
    const { toast } = useToast();
    const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { allCoursesCompleted } = useMemo(() => {
        const allCourses = allModules.flatMap(m => m.tracks.flatMap(t => t.courses));
        const allCourseIds = allCourses.map(c => c.id);
        const allCompleted = allCourseIds.length > 0 && allCourseIds.every(id => currentUser.completedCourses.includes(id));
        return { allCoursesCompleted: allCompleted };
    }, [allModules, currentUser.completedCourses]);

    useEffect(() => {
        const checkExistingSubmission = async () => {
            if (allCoursesCompleted) {
                try {
                    const existing = await findProjectSubmissionByUserId(currentUser.id);
                    setSubmission(existing);
                } catch (error) {
                    console.error("Failed to check for existing submission:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        checkExistingSubmission();
    }, [allCoursesCompleted, currentUser.id]);

    const initialState = { success: false, message: '' };
    const [state, formAction] = useActionState(submitProjectProposal, initialState);

    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Sucesso!' : 'Erro',
                description: state.message,
            });
            if (state.success) {
                // Optimistically update the UI to show the pending state
                setSubmission({
                    id: '', // Temp ID
                    userId: currentUser.id,
                    userName: currentUser.name,
                    userEmail: currentUser.email,
                    projectName: 'Seu projeto',
                    submissionDate: new Date(),
                    status: 'Pendente'
                });
            }
        }
    }, [state, toast, currentUser]);

    if (!allCoursesCompleted) {
        return null; // Don't show the card if not all courses are completed
    }

    if (isLoading) {
        return (
            <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-primary/10 border-primary/20 mt-8">
                <CardContent className="p-6 text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm mt-2">Verificando status do projeto...</p>
                </CardContent>
            </Card>
        );
    }
    
    if (submission) {
        if (submission.status === 'Aprovado') {
             return (
                <Card className="bg-gradient-to-br from-green-500/10 to-primary/10 border-green-500/20 mt-8">
                    <CardHeader className="text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <CardTitle className="text-2xl">Projeto Aprovado!</CardTitle>
                        <CardDescription>Parabéns! Você alcançou o nível Extra Classe. Seu projeto foi aprovado pela banca.</CardDescription>
                    </CardHeader>
                </Card>
            );
        }
        return (
            <Card className="bg-gradient-to-br from-blue-500/10 to-primary/10 border-blue-500/20 mt-8">
                <CardHeader className="text-center">
                    <Clock className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                    <CardTitle className="text-2xl">Candidatura em Análise</CardTitle>
                    <CardDescription>Sua candidatura para o projeto "{submission.projectName}" foi enviada e está aguardando avaliação da banca.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-primary/10 border-primary/20 mt-8">
            <form action={formAction}>
                <CardHeader className="text-center">
                    <Presentation className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                    <CardTitle className="text-2xl">Candidate-se ao Nível Extra Classe!</CardTitle>
                    <CardDescription>Para alcançar o último nível, proponha um projeto para ser avaliado pela nossa banca.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="w-full max-w-sm mx-auto space-y-2">
                        <Label htmlFor="projectName" className="sr-only">Nome do Projeto</Label>
                        <Input id="projectName" name="projectName" placeholder="Digite o nome do seu projeto aqui" required />
                     </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                    <Button type="submit" size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Presentation className="mr-2 h-5 w-5" />
                        Candidatar-se ao Projeto
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
