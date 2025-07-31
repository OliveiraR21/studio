
'use server';

import { cookies } from 'next/headers'
import { getUserById } from './data-access';
import type { User } from './types';
import { cache } from 'react';

// The default user to show if no one is logged in (e.g., first visit).
// This is user 'Admin'.
const DEFAULT_USER_ID = '1';

/**
 * Gets the ID of the currently logged-in user from the session cookie.
 * This function is cached to prevent multiple lookups in a single request.
 * @returns The user ID string, or a default ID if not logged in.
 */
export const getSimulatedUserId = cache(async (): Promise<string> => {
  const cookieStore = cookies();
  return cookieStore.get('simulated_user_id')?.value || DEFAULT_USER_ID;
});

/**
 * Fetches the complete data for the currently logged-in user.
 * This function is cached to prevent multiple database calls in a single request.
 * @returns The user object, or null if not found.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
    const userId = await getSimulatedUserId();
    const user = await getUserById(userId);
    return user;
});
