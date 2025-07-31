
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { generateCertificatePdf } from "@/actions/certificate-actions";
import type { User, Module } from "@/lib/types";

interface GeneralCertificateCardProps {
  allModules: Module[];
  currentUser: User;
}

export function GeneralCertificateCard({ allModules, currentUser }: GeneralCertificateCardProps) {
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);

    const { allCoursesCompleted, totalDurationInSeconds } = useMemo(() => {
        const allCourses = allModules.flatMap(m => m.tracks.flatMap(t => t.courses));
        const allCourseIds = allCourses.map(c => c.id);
        
        const allCompleted = allCourseIds.every(id => currentUser.completedCourses.includes(id));
        
        const totalDuration = allCourses.reduce((sum, course) => sum + (course.durationInSeconds || 0), 0);

        return { allCoursesCompleted: allCompleted, totalDurationInSeconds: totalDuration };
    }, [allModules, currentUser.completedCourses]);


    const handleDownloadCertificate = async () => {
        setIsDownloading(true);
        toast({ title: 'Gerando seu certificado...', description: 'Isso pode levar alguns segundos.' });
        try {
            const pdfDataUri = await generateCertificatePdf({
                userName: currentUser.preferredName || currentUser.name,
                itemName: 'Certificado de Conclusão Geral',
                durationInSeconds: totalDurationInSeconds,
                type: 'general'
            });

            const link = document.createElement('a');
            link.href = pdfDataUri;
            link.download = `Certificado_Geral_BrSupply.pdf`;
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
    
    if (!allCoursesCompleted) {
        return null;
    }

    return (
        <Card className="bg-gradient-to-br from-amber-500/10 via-destructive/10 to-primary/10 border-primary/20 mt-8">
            <CardHeader className="text-center">
                <Award className="h-12 w-12 text-amber-400 mx-auto mb-2" />
                <CardTitle className="text-2xl">Parabéns, Jornada Concluída!</CardTitle>
                <CardDescription>Você finalizou todos os módulos e trilhas disponíveis na plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                <Button 
                    onClick={handleDownloadCertificate} 
                    disabled={isDownloading}
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                    {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Award className="mr-2 h-5 w-5" />}
                    {isDownloading ? 'Gerando...' : 'Baixar Certificado Geral'}
                </Button>
            </CardContent>
        </Card>
    );
}
