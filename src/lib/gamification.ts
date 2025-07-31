import type { User, LevelInfo } from './types';

// --- Configuration ---

// XP awarded for each completed course
const XP_PER_COURSE = 10;

// Define the XP required to reach each level. The key is the level number.
const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 50,    // 5 courses to reach level 2
  3: 120,   // 7 more courses (12 total)
  4: 250,   // 13 more courses (25 total)
  5: 500,   // 25 more courses (50 total)
  6: 1000,  // 50 more courses (100 total)
};

// Define names for each level
const LEVEL_NAMES: Record<number, string> = {
    1: 'Iniciante',
    2: 'Aprendiz',
    3: 'Explorador',
    4: 'Especialista',
    5: 'Mestre',
    6: 'Lenda',
};

const MAX_LEVEL = Object.keys(LEVEL_THRESHOLDS).length;

/**
 * Calculates a user's current level, XP, and progress towards the next level.
 * @param user The user object, which must contain `completedCourses`.
 * @returns An object with the user's level information.
 */
export function calculateUserLevel(user: User): LevelInfo {
  const completedCoursesCount = user.completedCourses.length;
  const currentXp = completedCoursesCount * XP_PER_COURSE;

  let level = 1;
  // Find the current level by checking which threshold the user's XP has surpassed.
  for (const levelKey in LEVEL_THRESHOLDS) {
    const thresholdLevel = parseInt(levelKey, 10);
    if (currentXp >= LEVEL_THRESHOLDS[thresholdLevel]) {
      level = thresholdLevel;
    } else {
      break; // Stop when we find a threshold the user hasn't reached yet
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
