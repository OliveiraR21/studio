
import { getProjectSubmissions } from "@/actions/project-actions";
import { ProjectManagementClient } from "./project-management-client";

export default async function AdminProjectsPage() {
    const submissions = await getProjectSubmissions();
    
    return (
        <div className="container mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Gestão de Projetos - Extra Classe</h1>
                <p className="text-muted-foreground">
                    Avalie as candidaturas de projetos para o nível final de gamificação.
                </p>
            </div>
            <ProjectManagementClient initialSubmissions={submissions} />
        </div>
    )
}
