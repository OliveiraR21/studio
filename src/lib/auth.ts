import { cookies } from 'next/headers'
import { getUserById } from './data-access';
import type { User } from './types';

// The default user to show if no one is logged in (e.g., first visit).
// This is user 'Admin'.
const DEFAULT_USER_ID = '1';

/**
 * Gets the ID of the currently logged-in user from the session cookie.
 * @returns The user ID string, or a default ID if not logged in.
 */
export function getSimulatedUserId(): string {
  const cookieStore = cookies();
  return cookieStore.get('simulated_user_id')?.value || DEFAULT_USER_ID;
}

/**
 * Fetches the complete data for the currently logged-in user.
 * @returns The user object, or null if not found.
 */
export async function getCurrentUser(): Promise<User | null> {
    const userId = getSimulatedUserId();
    const user = await getUserById(userId);
    return user;
}
