import { getCurrentUser } from '@/lib/auth';
import { MainLayoutClient } from './layout-client';
import type { User } from '@/lib/types';
import { UserNotFound } from '@/components/layout/user-not-found';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <UserNotFound />
        </div>
    )
  }

  return (
    <MainLayoutClient user={user}>
        {children}
    </MainLayoutClient>
  );
}
