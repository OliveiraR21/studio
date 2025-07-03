import { UserManagementClient } from "@/components/admin/user-management-client";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/lib/data-access";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const allUsers = await getUsers();

  return (
    <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
                <p className="text-muted-foreground">
                    Visualize, crie e gerencie os usuários da plataforma.
                </p>
            </div>
            <Button asChild>
                <Link href="/admin/users/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Usuário
                </Link>
            </Button>
        </div>
        <UserManagementClient users={allUsers} />
    </div>
  );
}
