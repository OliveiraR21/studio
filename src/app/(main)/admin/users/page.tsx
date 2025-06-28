import { UserManagementClient } from "@/components/admin/user-management-client";
import { getUsers } from "@/lib/data-access";

export default async function AdminUsersPage() {
  const allUsers = await getUsers();

  return (
    <div className="container mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground">
                Visualize usuários e seus cargos e áreas.
            </p>
        </div>
        <UserManagementClient users={allUsers} />
    </div>
  );
}
