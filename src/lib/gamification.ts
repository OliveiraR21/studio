
import type { User, LevelInfo, Module } from './types';
import { getLearningModules, filterModulesForUser } from './data-access';

// --- Configuration ---

// Base XP is calculated as number of completed courses * 10.
const XP_PER_COURSE = 10;
// Bonus XP is calculated as average_score * 5. (e.g., 90% average score = 450 bonus XP)
const XP_PERFORMANCE_MULTIPLIER = 5;

// Define the XP required to reach each level.
const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,      // Bronze
  2: 60,     // Prata (e.g., ~5 courses + good grades)
  3: 200,    // Ouro (e.g., ~15 courses + good grades)
  4: 500,    // Diamante (Special Case: 100% completion + >95% score)
};

// Define names for each level
const LEVEL_NAMES: Record<number, string> = {
    1: 'Bronze',
    2: 'Prata',
    3: 'Ouro',
    4: 'Diamante',
};

const MAX_LEVEL = Object.keys(LEVEL_THRESHOLDS).length;

/**
 * Calculates a user's current level, XP, and progress towards the next level
 * based on course completion percentage and quiz performance.
 * @param user The user object.
 * @param allModules All available modules in the platform.
 * @returns An object with the user's level information.
 */
export async function calculateUserLevel(user: User, allModules: Module[]): Promise<LevelInfo> {
    
  // 1. Determine total accessible courses for the user
  const accessibleCourses = filterModulesForUser(allModules, user)
    .flatMap(m => m.tracks.flatMap(t => t.courses));
  const totalCoursesCount = accessibleCourses.length > 0 ? accessibleCourses.length : 1;
  const completedCoursesCount = user.completedCourses.filter(id => accessibleCourses.some(c => c.id === id)).length;

  // 2. Calculate average score
  const allScores = [...(user.courseScores ?? []).map(s => s.score), ...(user.trackScores ?? []).map(s => s.score)];
  const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  // 3. Calculate XP
  const completionPercentage = Math.round((completedCoursesCount / totalCoursesCount) * 100);
  // --- BUG FIX: Calculate base XP from course count, not percentage ---
  const baseXp = completedCoursesCount * XP_PER_COURSE; 
  const performanceXp = Math.round(averageScore * XP_PERFORMANCE_MULTIPLIER);
  const currentXp = baseXp + performanceXp;
  
  let level = 1;
  
  // 4. Determine Level, with special case for Diamond
  const isDiamondCandidate = completionPercentage >= 100 && averageScore > 95;

  if (isDiamondCandidate) {
      level = 4; // Diamante
  } else {
      // Find the current level by checking which threshold the user's XP has surpassed.
      for (const levelKey in LEVEL_THRESHOLDS) {
        const thresholdLevel = parseInt(levelKey, 10);
        // Don't allow reaching diamond level via XP alone
        if (thresholdLevel === MAX_LEVEL) continue;
        
        if (currentXp >= LEVEL_THRESHOLDS[thresholdLevel]) {
          level = thresholdLevel;
        } else {
          break; // Stop when we find a threshold the user hasn't reached yet
        }
      }
  }


  const xpForCurrentLevel = LEVEL_THRESHOLDS[level];
  const xpForNextLevel = level < MAX_LEVEL ? LEVEL_THRESHOLDS[level + 1] : xpForCurrentLevel;

  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const xpEarnedInCurrentLevel = currentXp - xpForCurrentLevel;

  // Calculate progress percentage, handling the max level case.
  const progressPercentage = (level < MAX_LEVEL && xpNeededForNextLevel > 0)
    ? Math.round((xpEarnedInCurrentLevel / xpNeededForNextLevel) * 100)
    : 100; // At max level, progress is 100%

  return {
    level,
    currentXp,
    xpForNextLevel: xpForNextLevel,
    progressPercentage,
    levelName: LEVEL_NAMES[level] || 'Desconhecido',
  };
}
