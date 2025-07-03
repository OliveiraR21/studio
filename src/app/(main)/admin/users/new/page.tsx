import { UserForm } from "@/components/admin/user-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getUsers } from "@/lib/data-access";

export default async function NewUserPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto space-y-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
            <Link href="/admin/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Gerenciamento de Usuários
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Usuário</CardTitle>
          <CardDescription>
            Preencha os detalhes abaixo para adicionar um novo usuário à plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm allUsers={users} />
        </CardContent>
      </Card>
    </div>
  );
}
