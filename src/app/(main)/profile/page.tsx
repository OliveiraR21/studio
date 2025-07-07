import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getUserById } from "@/lib/data-access";
import { User as UserIcon, Mail, Briefcase, Building2 } from "lucide-react";
import { UserNotFound } from "@/components/layout/user-not-found";
import { SIMULATED_USER_ID } from "@/lib/auth";

export default async function ProfilePage() {
  // In a real app, this would be the logged-in user from a session.
  // For the prototype, we use a simulated user ID from a central file.
  const currentUser = await getUserById(SIMULATED_USER_ID);

  if (!currentUser) {
    return <UserNotFound />;
  }

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
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="user avatar" />
                    <AvatarFallback className="text-3xl">{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
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
