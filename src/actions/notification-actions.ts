'use server';

import { getCurrentUser } from '@/lib/auth';
import { getNotificationsForUser } from '@/lib/data-access';
import type { Notification } from '@/lib/types';

export async function getNotifications(): Promise<Notification[]> {
    const user = await getCurrentUser();
    if (!user) {
        return [];
    }
    const notifications = await getNotificationsForUser(user);
    return notifications;
}
