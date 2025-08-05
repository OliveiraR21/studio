

export interface Module {
  id: string;
  title: string;
  description: string;
  tracks: Track[];
}

export interface Track {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order?: number;
  courses: Course[];
  // Every track can have a final quiz.
  quiz?: Quiz;
}

export interface Course {
  id: string;
  moduleId: string;
  trackId: string;
  title: string;
  description: string;
  order?: number;
  videoUrl: string;
  durationInSeconds?: number;
  thumbnailUrl?: string;
  createdAt: Date;
  likes?: number;
  dislikes?: number;
  voters?: string[]; // list of user IDs who have voted, for simulation
  quiz?: Quiz;
  // Access control fields
  minimumRole?: UserRole;
  accessAreas?: string[];
  transcript?: string;
}

export interface Quiz {
  questions: Question[];
}

export type QuestionDifficulty = 'Fácil' | 'Intermediário' | 'Difícil';

export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty?: QuestionDifficulty;
}

export type UserRole = 'Admin' | 'Diretor' | 'Gerente' | 'Coordenador' | 'Supervisor' | 'Analista' | 'Assistente';

// User progress is now more granular.
export interface User {
  id: string;
  name: string; // Full/Legal Name
  preferredName?: string; // Nickname or how they prefer to be called
  email: string;
  password?: string;
  role: UserRole;
  supervisor?: string;
  coordenador?: string;
  gerente?: string;
  diretor?: string;
  area?: string;
  avatarUrl?: string;
  
  // Track which courses and tracks have been completed.
  completedCourses: string[]; // List of course IDs
  completedTracks: string[]; // List of track IDs

  // Track scores for both course and track quizzes.
  courseScores?: { courseId: string; score: number; attempts: number }[];
  trackScores?: { trackId: string; score: number; attempts: number }[];

  // Flag to check if user has completed the onboarding tour.
  hasCompletedOnboarding?: boolean;
  // Flag to indicate completion of the final project for gamification
  hasCompletedProject?: boolean;
}


export interface Notification {
    id: string;
    userId: string; // Notifications are now user-specific
    title: string;
    description: string;
    createdAt: Date;
    read: boolean;
    href?: string;
    isProjectNotification?: boolean; // Differentiates project notifications
}

export interface QuestionProficiency {
  questionText: string;
  courseTitle: string;
  courseId: string;
  errorRate: number; // as a percentage, e.g., 75
}

export interface EngagementStats {
  avgSessionTime: string; // e.g., "25 min"
  peakTime: string; // e.g., "14h - 16h"
  completionRate: number; // e.g., 82
}

export interface ManagerPerformance {
    managerName: string;
    completionRate: number;
    averageScore: number;
}

export interface InactiveUsersReport {
  count: number;
  percentage: number;
  usersByManager: Record<string, { id: string; name: string }[]>;
}

export interface AnalyticsData {
  questionProficiency: QuestionProficiency[];
  engagementStats: EngagementStats;
  managerPerformance: ManagerPerformance[];
  inactiveUsersReport: InactiveUsersReport;
  totalUsers: number;
  totalCourses: number;
}

// Gamification Types
export interface LevelInfo {
  level: number;
  currentXp: number;
  xpForNextLevel: number;
  progressPercentage: number;
  levelName: string;
}

// Project Submission Types
export type SubmissionStatus = 'Pendente' | 'Aprovado' | 'Reprovado';

export interface ProjectSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  projectName: string;
  submissionDate: Date;
  status: SubmissionStatus;
}
