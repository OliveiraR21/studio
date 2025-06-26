import type { User, Course } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    completedTraining: ['course-001', 'course-003'],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'User',
    completedTraining: ['course-001'],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    completedTraining: [],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
   {
    id: '4',
    name: 'Emily White',
    email: 'emily.white@example.com',
    role: 'User',
    completedTraining: ['course-002', 'course-004'],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'User',
    completedTraining: ['course-005'],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
];

export const availableCourses: Course[] = [
  {
    id: 'course-001',
    title: 'Introduction to Workplace Safety',
    description: 'A comprehensive overview of essential safety protocols and procedures in the workplace.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://placehold.co/1920x1080.mp4',
    tags: ['Safety', 'Beginner'],
    quiz: {
      questions: [
        {
          text: 'What is the first step in case of a fire alarm?',
          options: ['Continue working', 'Evacuate immediately', 'Call a friend', 'Look for the source'],
          correctAnswer: 'Evacuate immediately',
        },
      ],
    },
  },
  {
    id: 'course-002',
    title: 'Advanced Forklift Operation',
    description: 'Master advanced techniques for safe and efficient forklift operation.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://placehold.co/1920x1080.mp4',
    tags: ['Equipment', 'Advanced'],
    quiz: {
      questions: [
        {
          text: 'When carrying a load, the forks should be:',
          options: ['As high as possible', 'Tilted forward', 'Low to the ground', 'At eye level'],
          correctAnswer: 'Low to the ground',
        },
      ],
    },
  },
  {
    id: 'course-003',
    title: 'Leadership and Team Management',
    description: 'Develop key leadership skills for managing and motivating your team effectively.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://placehold.co/1920x1080.mp4',
    tags: ['Management', 'Leadership'],
    quiz: {
      questions: [
        {
          text: 'What is a key trait of a good leader?',
          options: ['Micromanagement', 'Poor communication', 'Empathy', 'Avoiding decisions'],
          correctAnswer: 'Empathy',
        },
      ],
    },
  },
  {
    id: 'course-004',
    title: 'Chemical Handling and Safety',
    description: 'Learn the proper procedures for handling and storing chemicals safely.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://placehold.co/1920x1080.mp4',
    tags: ['Safety', 'Chemicals'],
    quiz: {
      questions: [
        {
          text: 'What does SDS stand for?',
          options: ['Safety Data Sheet', 'Safe Delivery System', 'Secure Data Storage', 'Systematic Drug Screening'],
          correctAnswer: 'Safety Data Sheet',
        },
      ],
    },
  },
  {
    id: 'course-005',
    title: 'Customer Service Excellence',
    description: 'Techniques for providing outstanding customer service and handling difficult situations.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://placehold.co/1920x1080.mp4',
    tags: ['Soft Skills', 'Customer Service'],
    quiz: {
      questions: [
        {
          text: 'What is the "LAST" model for handling complaints?',
          options: ['Listen, Apologize, Solve, Thank', 'Leave, Avoid, Stay, Talk', 'Listen, Argue, Sell, Terminate', 'Look, Act, Shout, Tell'],
          correctAnswer: 'Listen, Apologize, Solve, Thank',
        },
      ],
    },
  },
  {
    id: 'course-006',
    title: 'Logistics and Supply Chain Basics',
    description: 'An introduction to the fundamentals of modern logistics and supply chain management.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://placehold.co/1920x1080.mp4',
    tags: ['Logistics', 'Beginner'],
    quiz: {
      questions: [
        {
          text: 'What is a key component of a supply chain?',
          options: ['Marketing', 'Procurement', 'Human Resources', 'Sales'],
          correctAnswer: 'Procurement',
        },
      ],
    },
  }
];
