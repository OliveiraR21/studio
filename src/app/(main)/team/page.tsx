import { TeamManagementClient } from "@/components/team/team-management-client";
import { getUsers } from "@/lib/data-access";
import type { User } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserNotFound } from "@/components/layout/user-not-found";
import { getCurrentUser } from "@/lib/auth";

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

export default async function TeamManagementPage() {
  const allUsers = await getUsers();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return <UserNotFound />;
  }

  // For an Admin, show all users except the admin themselves.
  // For a Manager, get their subordinates.
  const teamMembers = currentUser.role === 'Admin'
    ? allUsers.filter(u => u.id !== currentUser.id)
    : getSubordinates(currentUser.name, allUsers);

  return (
    <div className="container mx-auto space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Equipe</h1>
            <p className="text-muted-foreground">
                Visualize o progresso e o desempenho dos membros da sua equipe. Use a busca para filtrar por nome.
            </p>
        </div>
        <TeamManagementClient teamMembers={teamMembers} allCoursesCount={0} />
    </div>
  );
}
