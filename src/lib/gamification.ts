

import type { User, LevelInfo, Module } from './types';

// --- Configuration ---

// Define the percentage thresholds for each level.
const LEVEL_THRESHOLDS = {
    NO_LEVEL: 33,
    BRONZE: 66,
    PRATA: 99,
    OURO: 100,
};

// Define names for each level number.
const LEVEL_NAMES: Record<number, string> = {
    0: 'Sem Nível',
    1: 'Bronze',
    2: 'Prata',
    3: 'Ouro',
    4: 'Diamante',
};

const DIAMOND_MINIMUM_SCORE = 95;
const MAX_LEVEL = Object.keys(LEVEL_NAMES).length -1;


/**
 * Calculates a user's current level and progress based on the percentage of completed courses.
 * @param user The user object.
 * @param allModules All available modules in the platform.
 * @returns An object with the user's level information.
 */
export async function calculateUserLevel(user: User, allModules: Module[]): Promise<LevelInfo> {
    
  // 1. Get the TOTAL number of courses on the platform, regardless of access.
  const allPlatformCourses = allModules.flatMap(m => m.tracks.flatMap(t => t.courses));
  const totalCourses = allPlatformCourses.length > 0 ? allPlatformCourses.length : 1; // Avoid division by zero
  const completedCoursesCount = user.completedCourses.length;

  // 2. Calculate completion percentage. This is the primary driver for levels.
  const completionPercentage = Math.round((completedCoursesCount / totalCourses) * 100);

  // 3. Calculate average score for the Diamond level condition.
  const allScores = [...(user.courseScores ?? []).map(s => s.score), ...(user.trackScores ?? []).map(s => s.score)];
  const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
  
  // 4. Determine Level based on new percentage rules.
  let level: number;
  let levelName: string;

  const isDiamondCandidate = (completionPercentage === 100 && averageScore > DIAMOND_MINIMUM_SCORE);

  if (isDiamondCandidate) {
      level = 4;
      levelName = LEVEL_NAMES[4];
  } else if (completionPercentage === LEVEL_THRESHOLDS.OURO) {
      level = 3;
      levelName = LEVEL_NAMES[3];
  } else if (completionPercentage > LEVEL_THRESHOLDS.BRONZE) {
      level = 2;
      levelName = LEVEL_NAMES[2];
  } else if (completionPercentage > LEVEL_THRESHOLDS.NO_LEVEL) {
      level = 1;
      levelName = LEVEL_NAMES[1];
  } else {
      level = 0;
      levelName = LEVEL_NAMES[0];
  }

  // The progress bar will now directly reflect the course completion percentage.
  // The concept of "XP" is abstracted away in favor of this direct metric.
  const progressPercentageForBar = level === MAX_LEVEL ? 100 : completionPercentage;

  return {
    level,
    progressPercentage: progressPercentageForBar,
    levelName,
    // The 'xp' fields are now less central, but can be used for display if needed.
    // We'll map the percentage directly to these fields for simplicity.
    currentXp: completionPercentage,
    xpForNextLevel: 100,
  };
}
