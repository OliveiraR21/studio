import type { User, Course, UserRole } from './types';

// Defines the hierarchy of roles, from lowest to highest.
const ROLE_HIERARCHY: UserRole[] = ['Assistente', 'Analista', 'Supervisor', 'Coordenador', 'Gerente', 'Diretor', 'Admin'];

/**
 * Checks if a user has access to a specific course based on their role and area.
 * @param user The user object.
 * @param course The course object.
 * @returns True if the user has access, false otherwise.
 */
export function userHasCourseAccess(user: User, course: Course): boolean {
  // 1. Role-based access check (hierarchical)
  const hasRoleAccess = (() => {
    if (!course.minimumRole) {
        return true; // No minimum role, accessible to all
    }
    const userLevel = ROLE_HIERARCHY.indexOf(user.role);
    const requiredLevel = ROLE_HIERARCHY.indexOf(course.minimumRole);

    if (userLevel === -1 || requiredLevel === -1) {
        return false; // Role not found in hierarchy, deny access
    }

    return userLevel >= requiredLevel;
  })();

  if (!hasRoleAccess) {
    return false;
  }

  // 2. Area-based access check
  const hasAreaAccess = (() => {
    if (!course.accessAreas || course.accessAreas.length === 0) {
        return true; // No area restrictions, accessible to all
    }
    if (!user.area) {
        return false; // User has no area, but course requires one
    }
    return course.accessAreas.includes(user.area);
  })();
  
  return hasAreaAccess;
}
