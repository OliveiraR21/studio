import { TeamManagementClient } from "@/components/team/team-management-client";
import { users } from "@/lib/data";
import type { User } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// This function recursively finds all subordinates for a given manager.
const getSubordinates = (managerName: string, allUsers: User[]): User[] => {
    const directReports = allUsers.filter(u => 
        u.supervisor === managerName ||
        u.coordenador === managerName ||
        u.gerente === managerName ||
        u.diretor === managerName
    );

    let allSubordinates = [...directReports];

    directReports.forEach(report => {
        const subordinatesOfReport = getSubordinates(report.name, allUsers);
        allSubordinates = [...allSubordinates, ...subordinatesOfReport];
    });

    // Remove duplicates using a Map
    return [...new Map(allSubordinates.map(item => [item.id, item])).values()];
};

export default function TeamManagementPage() {
  // In a real app, this would be the logged-in user from a session.
  // We are simulating a 'Gerente' (Manager) login.
  const currentUser = users.find(u => u.role === 'Gerente');
  
  if (!currentUser) {
    return (
        <div className="container mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Equipe não encontrada</CardTitle>
                    <CardDescription>
                        Não foi possível encontrar um usuário com função de gerência para exibir a equipe. Verifique os dados em <code className="font-mono bg-muted p-1 rounded">src/lib/data.ts</code>.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  // For an Admin, show all users except the admin themselves.
  // For a Manager, get their subordinates.
  const teamMembers = currentUser.role === 'Admin'
    ? users.filter(u => u.id !== currentUser.id)
    : getSubordinates(currentUser.name, users);

  return (
    <div className="container mx-auto space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Equipe</h1>
            <p className="text-muted-foreground">
                Visualize o progresso e o desempenho dos membros da sua equipe. Use a busca para filtrar por nome.
            </p>
        </div>
        <TeamManagementClient teamMembers={teamMembers} />
    </div>
  );
}
