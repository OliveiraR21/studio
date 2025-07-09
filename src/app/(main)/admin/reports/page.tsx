import { getAnalyticsData } from "@/lib/data-access";
import { AnalyticsClient } from "@/components/admin/analytics-client";

export default async function AdminReportsPage() {
  const analyticsData = await getAnalyticsData();

  return <AnalyticsClient data={analyticsData} />;
}
