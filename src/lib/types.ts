export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  tags?: string[];
  quiz: Quiz;
  accessRoles?: UserRole[];
  accessAreas?: string[];
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  supervisor?: string;
  coordenador?: string;
  gerente?: string;
  diretor?: string;
  area?: string;
  completedTraining: string[];
  avatarUrl: string;
  quizScores?: { courseId: string; score: number }[];
}
