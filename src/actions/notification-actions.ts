
'use server';

import { getCurrentUser } from '@/lib/auth';
import { getNotificationsForUser, markNotificationsAsRead as markAsRead } from '@/lib/data-access';
import type { Notification } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getNotifications(): Promise<Notification[]> {
    const user = await getCurrentUser();
    if (!user) {
        return [];
    }
    const notifications = await getNotificationsForUser(user);
    return notifications;
}

export async function markNotificationsAsRead(userId: string, notificationId?: string): Promise<void> {
    await markAsRead(userId, notificationId);
    // Revalidate the path for the layout to ensure the bell icon updates.
    // This is a broad revalidation; in a real-world scenario, you might target this more specifically.
    revalidatePath('/', 'layout');
}
