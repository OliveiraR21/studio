"use client";

import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Briefcase, Camera, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface ProfilePageClientProps {
    user: User;
}

export function ProfilePageClient({ user }: ProfilePageClientProps) {
    const { toast } = useToast();

    const getInitials = (name: string): string => {
        if (!name) return '';
        const nameParts = name.split(' ').filter(part => part); // Filter out empty strings
        if (nameParts.length > 1) {
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    const handleCameraClick = () => {
        toast({
            title: "Funcionalidade em desenvolvimento",
            description: "A alteração de foto de perfil ainda não foi implementada."
        });
    };

    return (
        <div className="container mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Meu Perfil</h1>
                <p className="text-muted-foreground">
                    Visualize e gerencie suas informações pessoais e de progresso.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Avatar className="h-24 w-24 border-4 border-primary/20">
                                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                                <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 text-white hover:bg-white/20 hover:text-white"
                                    onClick={handleCameraClick}
                                >
                                    <Camera className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold">{user.name}</h2>
                            <p className="text-lg text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <UserIcon className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-muted-foreground">Cargo</p>
                                <p className="font-semibold">{user.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Building2 className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-muted-foreground">Área</p>
                                <p className="font-semibold">{user.area}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-muted-foreground">Gestor Direto</p>
                                <p className="font-semibold">{user.supervisor || user.coordenador || user.gerente || user.diretor || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Meu Desempenho</CardTitle>
                    <CardDescription>Resumo do seu progresso na plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for stats - In a real app, you'd fetch and display user's stats here */}
                    <div className="text-center text-muted-foreground py-8">
                        <p>Gráficos de progresso e estatísticas de desempenho seriam exibidos aqui.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
