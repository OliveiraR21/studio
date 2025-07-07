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
  courses: Course[];
  // Every track must have a final quiz.
  quiz: Quiz;
}

export interface Course {
  id: string;
  moduleId: string;
  trackId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationInSeconds?: number;
  // A course can optionally have a quiz.
  quiz?: Quiz;
  likes?: number;
  dislikes?: number;
}

export interface Quiz {
  questions: Question[];
}

export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

export type UserRole = 'Admin' | 'Diretor' | 'Gerente' | 'Coordenador' | 'Supervisor' | 'Analista' | 'Assistente';

// User progress is now more granular.
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  supervisor?: string;
  coordenador?: string;
  gerente?: string;
  diretor?: string;
  area?: string;
  avatarUrl: string;
  
  // Track which courses and tracks have been completed.
  completedCourses: string[]; // List of course IDs
  completedTracks: string[]; // List of track IDs

  // Track scores for both course and track quizzes.
  courseScores?: { courseId: string; score: number; attempts: number }[];
  trackScores?: { trackId: string; score: number; attempts: number }[];
}
