export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  tags?: string[];
  quiz: Quiz;
}

export interface Quiz {
  questions: Question[];
}

export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Diretor' | 'Gerente' | 'Coordenador' | 'Supervisor' | 'Usuário';
  supervisor?: string;
  coordenador?: string;
  gerente?: string;
  diretor?: string;
  area?: string;
  completedTraining: string[];
  avatarUrl: string;
  quizScores?: { courseId: string; score: number }[];
}
