
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { User as UserIcon, Mail, Briefcase, Building2, Camera } from "lucide-react";
import { UserNotFound } from "@/components/layout/user-not-found";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <UserNotFound />;
  }
  
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
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
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="user avatar" />
                        <AvatarFallback className="text-3xl">{getInitials(currentUser.name)}</AvatarFallback>
                    </Avatar>
                     <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/20 hover:text-white"
                          onClick={() => alert('Funcionalidade de alterar foto em desenvolvimento.')}
                        >
                            <Camera className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-bold">{currentUser.name}</h2>
                    <p className="text-lg text-muted-foreground">{currentUser.email}</p>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <UserIcon className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-muted-foreground">Cargo</p>
                        <p className="font-semibold">{currentUser.role}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-muted-foreground">Área</p>
                        <p className="font-semibold">{currentUser.area}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-muted-foreground">Gestor Direto</p>
                        <p className="font-semibold">{currentUser.supervisor || currentUser.coordenador || currentUser.gerente || currentUser.diretor || 'N/A'}</p>
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
