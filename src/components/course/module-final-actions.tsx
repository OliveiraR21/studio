
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { generateCertificatePdf } from "@/actions/certificate-actions";
import type { User, Module } from "@/lib/types";

interface ModuleFinalActionsProps {
    module: Module;
    currentUser: User;
    isModuleCompleted: boolean;
}

export function ModuleFinalActions({ module, currentUser, isModuleCompleted }: ModuleFinalActionsProps) {
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);

    const moduleDurationInSeconds = useMemo(() => {
        return module.tracks.reduce((total, track) => {
            const trackDuration = track.courses.reduce((courseTotal, course) => {
                return courseTotal + (course.durationInSeconds || 0);
            }, 0);
            return total + trackDuration;
        }, 0);
    }, [module]);

    const handleDownloadCertificate = async () => {
        setIsDownloading(true);
        toast({ title: 'Gerando seu certificado...', description: 'Isso pode levar alguns segundos.' });
        try {
            const pdfDataUri = await generateCertificatePdf({
                userName: currentUser.name,
                moduleName: module.title,
                moduleDurationInSeconds: moduleDurationInSeconds,
            });

            const link = document.createElement('a');
            link.href = pdfDataUri;
            link.download = `Certificado-${module.title.replace(/ /g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Erro ao gerar certificado',
                description: error instanceof Error ? error.message : 'Tente novamente.',
            });
        } finally {
            setIsDownloading(false);
        }
    };
    
    if (!isModuleCompleted) {
        return null;
    }

    return (
        <Card className="bg-green-500/10 border-green-500/20 mt-6">
            <CardHeader className="text-center">
                <Award className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <CardTitle>Parabéns, módulo concluído!</CardTitle>
                <CardDescription>Você finalizou todas as trilhas do módulo "{module.title}".</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                <Button 
                    onClick={handleDownloadCertificate} 
                    disabled={isDownloading}
                    size="lg"
                >
                    {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Award className="mr-2 h-5 w-5" />}
                    {isDownloading ? 'Gerando...' : 'Baixar Certificado do Módulo'}
                </Button>
            </CardContent>
        </Card>
    );
}
