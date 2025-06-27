import { TrackManagementClient } from "@/components/admin/track-management-client";

export default function AdminTracksPage() {
  return (
    <div className="container mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Trilhas e Módulos</h1>
            <p className="text-muted-foreground">
                Visualize a estrutura de módulos e trilhas de aprendizagem. A criação e edição são feitas no arquivo <code className="font-mono bg-muted p-1 rounded">src/lib/data.ts</code>.
            </p>
        </div>
        <TrackManagementClient />
    </div>
  );
}
