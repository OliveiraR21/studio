import { getCurrentUser } from "@/lib/auth";
import { UserNotFound } from "@/components/layout/user-not-found";
import { ProfilePageClient } from "./profile-page-client";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <UserNotFound />;
  }
  
  return <ProfilePageClient user={currentUser} />;
}
