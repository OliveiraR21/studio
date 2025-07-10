
"use client";

import { useRef, useState } from "react";
import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Briefcase, Camera, Loader2, User as UserIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateUserAvatar, removeUserAvatar } from "@/actions/user-actions";


interface ProfilePageClientProps {
    user: User;
}

export function ProfilePageClient({ user: initialUser }: ProfilePageClientProps) {
    const { toast } = useToast();
    const [user, setUser] = useState(initialUser);
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string): string => {
        if (!name) return '';
        const nameParts = name.split(' ').filter(part => part);
        if (nameParts.length > 1) {
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
        if (nameParts.length === 1 && nameParts[0].length > 0) {
            return nameParts[0][0].toUpperCase();
        }
        return '';
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleRemoveClick = async () => {
        setIsRemoving(true);
        const response = await removeUserAvatar();
        if (response.success) {
            setUser(prevUser => ({ ...prevUser, avatarUrl: undefined }));
            toast({
                title: "Sucesso!",
                description: response.message
            });
        } else {
             toast({
                variant: "destructive",
                title: "Erro ao Remover",
                description: response.message
            });
        }
        setIsRemoving(false);
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Convert file to data URI
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const result = reader.result as string;
            const response = await updateUserAvatar(result);

            if (response.success) {
                // Optimistically update the UI
                setUser(prevUser => ({ ...prevUser, avatarUrl: result }));
                toast({
                    title: "Sucesso!",
                    description: response.message
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro no Upload",
                    description: response.message
                });
            }
            setIsUploading(false);
        };
        reader.onerror = (error) => {
            console.error("File reading error:", error);
            toast({
                variant: "destructive",
                title: "Erro de Leitura",
                description: "Não foi possível ler o arquivo de imagem."
            });
            setIsUploading(false);
        };
    };

    return (
        <div className="container mx-auto space-y-6">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
            />
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
                                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />}
                                <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-white hover:bg-white/20 hover:text-white"
                                    onClick={handleCameraClick}
                                    disabled={isUploading || isRemoving}
                                >
                                    {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                                </Button>
                                {user.avatarUrl && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-white hover:bg-destructive/50 hover:text-white"
                                        onClick={handleRemoveClick}
                                        disabled={isUploading || isRemoving}
                                    >
                                        {isRemoving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                    </Button>
                                )}
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
                                <p className="font-semibold">{user.area || 'Não definida'}</p>
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
        </div>
    );
}
