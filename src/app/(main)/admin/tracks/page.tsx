import { TrackManagementClient } from "@/components/admin/track-management-client";
import { getLearningModules } from "@/lib/data-access";

export default async function AdminTracksPage() {
  const modules = await getLearningModules();

  return (
    <div className="container mx-auto">
        <TrackManagementClient modules={modules} />
    </div>
  );
}
