

import type { User, LevelInfo, Module } from './types';

// --- Configuration ---

const XP_CONFIG = {
    INITIAL_TOUR: 30,
    COMPLETE_COURSE: 10,
    COMPLETE_TRACK: 50,
    COMPLETE_MODULE: 500, // Major bonus
    QUIZ_FIRST_ATTEMPT: 25,
    QUIZ_PASS: 30, // For score >= 90%
    QUIZ_IMPROVEMENT_BONUS: 40, // Retaking a passed quiz and scoring higher
    QUIZ_EXCELLENCE_BONUS: 75, // For score 95-99%
    QUIZ_PERFECTION_BONUS: 150, // For score 100%
    PROJECT_APPROVED: 2000, // XP for getting the Extra Classe project approved
};


// Define the XP thresholds for each level.
const LEVEL_THRESHOLDS: Record<number, number> = {
    0: 0,       // Ferro
    1: 150,     // Bronze
    2: 800,     // Prata
    3: 1500,    // Ouro
    4: 2500,    // Platina
    5: 3500,    // Esmeralda
    6: 4900,    // Diamante
    7: 6000,    // Grão-Mestre
    8: 8000,    // Mestre
    9: 10000,   // Extra Classe
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
    7: 'Grão-Mestre',
    8: 'Mestre',
    9: 'Extra Classe',
};

const MAX_LEVEL = Object.keys(LEVEL_NAMES).length - 1;


/**
 * Calculates a user's current level and progress based on a detailed XP system.
 * @param user The user object.
 * @param allModules All available modules in the platform.
 * @returns An object with the user's level information.
 */
export async function calculateUserLevel(user: User, allModules: Module[]): Promise<LevelInfo> {
    let totalXp = 0;

    // 1. Onboarding Tour XP
    if (user.hasCompletedOnboarding) {
        totalXp += XP_CONFIG.INITIAL_TOUR;
    }

    // 2. Content Completion XP
    totalXp += user.completedCourses.length * XP_CONFIG.COMPLETE_COURSE;
    totalXp += user.completedTracks.length * XP_CONFIG.COMPLETE_TRACK;

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
    totalXp += completedModulesCount * XP_CONFIG.COMPLETE_MODULE;

    // 3. Quiz Performance XP
    const allScores = [...(user.courseScores || []), ...(user.trackScores || [])];
    
    allScores.forEach(scoreInfo => {
        // XP for the first attempt
        if (scoreInfo.attempts === 1) {
            totalXp += XP_CONFIG.QUIZ_FIRST_ATTEMPT;
        }

        // XP for passing
        if (scoreInfo.score >= 90) {
            totalXp += XP_CONFIG.QUIZ_PASS;
        }
        
        // XP for improvement
        if (scoreInfo.attempts > 1) {
            // This assumes we would store previous scores to check for actual improvement.
            // For this simulation, we grant it on any attempt after the first if the user passed.
            if(scoreInfo.score >= 90) {
                 totalXp += XP_CONFIG.QUIZ_IMPROVEMENT_BONUS;
            }
        }
        
        // XP for excellence
        if (scoreInfo.score >= 95 && scoreInfo.score < 100) {
            totalXp += XP_CONFIG.QUIZ_EXCELLENCE_BONUS;
        }
        
        // XP for perfection
        if (scoreInfo.score === 100) {
            totalXp += XP_CONFIG.QUIZ_PERFECTION_BONUS;
        }
    });

    // 4. Project Approval XP
    if (user.hasCompletedProject) {
        totalXp += XP_CONFIG.PROJECT_APPROVED;
    }

    const currentXp = totalXp;

    // Determine Level based on XP
    let level = 0;
    for (let i = MAX_LEVEL; i >= 0; i--) {
        if (currentXp >= LEVEL_THRESHOLDS[i]) {
            level = i;
            break;
        }
    }

    const levelName = LEVEL_NAMES[level];
    const xpForCurrentLevel = LEVEL_THRESHOLDS[level];
    const xpForNextLevel = level < MAX_LEVEL ? LEVEL_THRESHOLDS[level + 1] : currentXp;
    
    const xpInCurrentLevel = currentXp - xpForCurrentLevel;
    const xpRangeForLevel = xpForNextLevel - xpForCurrentLevel;

    const progressPercentage = level < MAX_LEVEL ? (xpRangeForLevel > 0 ? Math.round((xpInCurrentLevel / xpRangeForLevel) * 100) : 0) : 100;

    return {
        level,
        levelName,
        currentXp,
        xpForNextLevel,
        progressPercentage,
    };
}
