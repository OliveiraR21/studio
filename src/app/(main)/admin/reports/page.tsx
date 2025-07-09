import { getAnalyticsData } from "@/lib/data-access";
import { AnalyticsClient } from "@/components/admin/analytics-client";

export default async function AdminReportsPage() {
  const analyticsData = await getAnalyticsData();

  return (
    <div className="container mx-auto space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
            <p className="text-muted-foreground">
                Insights sobre o engajamento dos usuários e a eficácia do conteúdo.
            </p>
        </div>
        <AnalyticsClient data={analyticsData} />
    </div>
  );
}
