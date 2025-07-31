import { getCurrentUser } from '@/lib/auth';
import { MainLayoutClient } from './layout-client';
import type { User, LevelInfo } from '@/lib/types';
import { UserNotFound } from '@/components/layout/user-not-found';
import { calculateUserLevel } from '@/lib/gamification';

export const dynamic = 'force-dynamic';

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

  const levelInfo = calculateUserLevel(user);

  return (
    <MainLayoutClient user={user} levelInfo={levelInfo}>
        {children}
    </MainLayoutClient>
  );
}
