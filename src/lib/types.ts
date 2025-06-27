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
  role: 'Admin' | 'Usuário';
  completedTraining: string[];
  avatarUrl: string;
}
