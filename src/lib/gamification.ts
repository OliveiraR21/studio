
import type { User, LevelInfo, Module } from './types';

// --- Configuration ---

const XP_PER_COURSE = 10;
const XP_PER_TRACK = 50;
const XP_PER_MODULE = 100;
const XP_PERFORMANCE_MULTIPLIER = 0.5; // 50% of average score is added as bonus XP

// Define the XP thresholds for each level.
const LEVEL_THRESHOLDS: Record<number, number> = {
    0: 0,       // Ferro
    1: 150,     // Bronze
    2: 800,     // Prata
    3: 1500,    // Ouro
    4: 2500,    // Platina
    5: 3500,    // Esmeralda
    6: 4200,    // Diamante
    7: 4900,    // Mestre
    8: 6000,    // Grão-Mestre
    9: 8000,    // Desafiante
};

// Define names for each level number.
const LEVEL_NAMES: Record<number, string> = {
    0: 'Ferro',
    1: 'Bronze',
    2: 'Prata',
    3: 'Ouro',
    4: 'Platina',
    5: 'Esmeralda',
    6: 'Diamante',
    7: 'Mestre',
    8: 'Grão-Mestre',
    9: 'Desafiante',
};

const MAX_LEVEL = Object.keys(LEVEL_NAMES).length - 1;


/**
 * Calculates a user's current level and progress based on XP earned from various activities.
 * @param user The user object.
 * @param allModules All available modules in the platform.
 * @returns An object with the user's level information.
 */
export async function calculateUserLevel(user: User, allModules: Module[]): Promise<LevelInfo> {
    
    // 1. Calculate XP from completed courses
    const xpFromCourses = user.completedCourses.length * XP_PER_COURSE;
    
    // 2. Calculate XP from completed tracks
    const xpFromTracks = user.completedTracks.length * XP_PER_TRACK;

    // 3. Calculate XP from completed modules
    const allTracksByModule = allModules.reduce((acc, module) => {
        acc[module.id] = module.tracks.map(t => t.id);
        return acc;
    }, {} as Record<string, string[]>);
    
    let completedModulesCount = 0;
    for (const moduleId in allTracksByModule) {
        const moduleTracks = allTracksByModule[moduleId];
        if (moduleTracks.length > 0 && moduleTracks.every(trackId => user.completedTracks.includes(trackId))) {
            completedModulesCount++;
        }
    }
    const xpFromModules = completedModulesCount * XP_PER_MODULE;

    // 4. Calculate bonus XP from performance
    const allScores = [...(user.courseScores ?? []).map(s => s.score), ...(user.trackScores ?? []).map(s => s.score)];
    const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    const xpFromPerformance = Math.round(averageScore * XP_PERFORMANCE_MULTIPLIER);

    // 5. Calculate Total XP
    const currentXp = xpFromCourses + xpFromTracks + xpFromModules + xpFromPerformance;

    // 6. Determine Level
    let level = 0;
    for (let i = MAX_LEVEL; i >= 0; i--) {
        if (currentXp >= LEVEL_THRESHOLDS[i]) {
            level = i;
            break;
        }
    }

    const levelName = LEVEL_NAMES[level];

    // 7. Calculate progress towards next level
    const xpForCurrentLevel = LEVEL_THRESHOLDS[level];
    const xpForNextLevel = level < MAX_LEVEL ? LEVEL_THRESHOLDS[level + 1] : currentXp;
    
    const xpInCurrentLevel = currentXp - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

    const progressPercentage = (xpNeededForNextLevel > 0) 
        ? Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100) 
        : 100;

    return {
        level,
        levelName,
        currentXp,
        xpForNextLevel,
        progressPercentage,
    };
}
