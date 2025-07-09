import type { User, Course, UserRole } from './types';

// Defines the hierarchy of roles, from lowest to highest.
const ROLE_HIERARCHY: UserRole[] = ['Assistente', 'Analista', 'Supervisor', 'Coordenador', 'Gerente', 'Diretor', 'Admin'];

/**
 * Checks if a user has access to a specific course based on their role and area.
 * This function now correctly handles combined and separate restrictions for roles and areas.
 * @param user The user object.
 * @param course The course object.
 * @returns True if the user has access, false otherwise.
 */
export function userHasCourseAccess(user: User, course: Course): boolean {
  // Admins have access to everything, so we can bypass all other checks.
  if (user.role === 'Admin') {
    return true;
  }

  // Determine if the course has role or area restrictions.
  // The value 'none' is used by the form for "no selection".
  const isRoleRestricted = !!course.minimumRole && course.minimumRole !== 'none';
  const isAreaRestricted = !!course.accessAreas && course.accessAreas.length > 0;

  // If there are no restrictions at all, the course is public.
  if (!isRoleRestricted && !isAreaRestricted) {
    return true;
  }

  // --- Check Role Access ---
  // This check is only relevant if the course is restricted by role.
  const roleCheckPasses = (() => {
    // If not restricted by role, this check is automatically passed.
    if (!isRoleRestricted) {
      return true;
    }
    
    const userLevel = ROLE_HIERARCHY.indexOf(user.role);
    const requiredLevel = ROLE_HIERARCHY.indexOf(course.minimumRole!);

    // If either role isn't in our defined hierarchy, deny access as a safeguard.
    if (userLevel === -1 || requiredLevel === -1) {
      return false; 
    }

    // The user's level must be greater than or equal to the required level.
    return userLevel >= requiredLevel;
  })();

  // --- Check Area Access ---
  // This check is only relevant if the course is restricted by area.
  const areaCheckPasses = (() => {
    // If not restricted by area, this check is automatically passed.
    if (!isAreaRestricted) {
      return true;
    }
    
    // If the course requires an area but the user doesn't have one, deny access.
    if (!user.area) {
      return false;
    }
    
    // The user's area must be in the list of allowed areas for the course.
    return course.accessAreas!.includes(user.area);
  })();
  
  // The user must pass BOTH the role and area checks.
  // Since non-restricted checks automatically pass (return true),
  // this works for all cases: role-only, area-only, and both.
  return roleCheckPasses && areaCheckPasses;
}
