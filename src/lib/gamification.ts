
import type { User, LevelInfo, Module } from './types';

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
    
  // 1. Get the TOTAL number of courses on the platform, regardless of access.
  const allPlatformCourses = allModules.flatMap(m => m.tracks.flatMap(t => t.courses));
  const completedCoursesCount = user.completedCourses.length;

  // 2. Calculate average score
  const allScores = [...(user.courseScores ?? []).map(s => s.score), ...(user.trackScores ?? []).map(s => s.score)];
  const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  // 3. Calculate XP based on the number of completed courses, not percentage.
  const baseXp = completedCoursesCount * XP_PER_COURSE; 
  const performanceXp = Math.round(averageScore * XP_PERFORMANCE_MULTIPLIER);
  const currentXp = baseXp + performanceXp;
  
  let level = 1;
  
  // 4. Determine Level, with special case for Diamond
  // Check if the user has completed ALL courses on the platform.
  const allPlatformCourseIds = allPlatformCourses.map(c => c.id);
  const hasCompletedAllCourses = allPlatformCourseIds.every(id => user.completedCourses.includes(id));
  
  const isDiamondCandidate = hasCompletedAllCourses && averageScore > 95;

  if (isDiamondCandidate) {
      level = 4; // Diamante
  } else {
      // Find the current level by checking which threshold the user's XP has surpassed.
      // We iterate backwards to find the highest level achieved.
      for (let i = MAX_LEVEL; i > 0; i--) {
        if (i === MAX_LEVEL && !isDiamondCandidate) continue; // Skip diamond if not candidate

        if (currentXp >= LEVEL_THRESHOLDS[i]) {
          level = i;
          break;
        }
      }
  }

  const xpForCurrentLevel = LEVEL_THRESHOLDS[level];
  const xpForNextLevel = level < MAX_LEVEL ? LEVEL_THRESHOLDS[level + 1] : xpForCurrentLevel;

  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const xpEarnedInCurrentLevel = currentXp - xpForCurrentLevel;

  // Calculate progress percentage, handling the max level case.
  const progressPercentage = (level < MAX_LEVEL && xpNeededForNextLevel > 0)
    ? Math.min(100, Math.round((xpEarnedInCurrentLevel / xpNeededForNextLevel) * 100))
    : 100; // At max level, progress is 100%

  return {
    level,
    currentXp,
    xpForNextLevel: xpForNextLevel,
    progressPercentage,
    levelName: LEVEL_NAMES[level] || 'Desconhecido',
  };
}
