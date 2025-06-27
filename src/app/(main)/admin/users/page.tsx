import { UserManagementClient } from "@/components/admin/user-management-client";
import { users, availableCourses } from "@/lib/data";

export default function AdminUsersPage() {
  // In a real app, you would fetch this data from your database
  // and check for admin privileges.
  const allUsers = users;
  const allCourses = availableCourses;

  return (
    <div className="container mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground">
                Visualize usuários e atribua treinamentos sugeridos por IA.
            </p>
        </div>
        <UserManagementClient users={allUsers} courses={allCourses} />
    </div>
  );
}
