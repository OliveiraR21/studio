import type { User, Course } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Usuário Admin',
    email: 'admin@example.com',
    role: 'Admin',
    completedTraining: ['course-001', 'course-003'],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Usuário',
    completedTraining: ['course-001'],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Usuário',
    completedTraining: [],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
   {
    id: '4',
    name: 'Emily White',
    email: 'emily.white@example.com',
    role: 'Usuário',
    completedTraining: ['course-002', 'course-004'],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'Usuário',
    completedTraining: ['course-005'],
    avatarUrl: 'https://placehold.co/100x100.png',
  },
];

export const availableCourses: Course[] = [
  {
    id: 'course-001',
    title: 'Introdução à Segurança no Trabalho',
    description: 'Uma visão abrangente dos protocolos e procedimentos essenciais de segurança no local de trabalho.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
    tags: ['Segurança', 'Iniciante'],
    quiz: {
      questions: [
        {
          text: 'Qual é o primeiro passo em caso de um alarme de incêndio?',
          options: ['Continuar trabalhando', 'Evacuar imediatamente', 'Ligar para um amigo', 'Procurar a fonte'],
          correctAnswer: 'Evacuar imediatamente',
        },
      ],
    },
  },
  {
    id: 'course-002',
    title: 'Operação Avançada de Empilhadeira',
    description: 'Domine técnicas avançadas para uma operação segura e eficiente de empilhadeiras.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
    tags: ['Equipamento', 'Avançado'],
    quiz: {
      questions: [
        {
          text: 'Ao carregar uma carga, os garfos devem estar:',
          options: ['O mais alto possível', 'Inclinados para frente', 'Rentes ao chão', 'Na altura dos olhos'],
          correctAnswer: 'Rentes ao chão',
        },
      ],
    },
  },
  {
    id: 'course-003',
    title: 'Liderança e Gestão de Equipes',
    description: 'Desenvolva habilidades de liderança essenciais para gerenciar e motivar sua equipe de forma eficaz.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
    tags: ['Gestão', 'Liderança'],
    quiz: {
      questions: [
        {
          text: 'Qual é uma característica fundamental de um bom líder?',
          options: ['Microgerenciamento', 'Comunicação ruim', 'Empatia', 'Evitar decisões'],
          correctAnswer: 'Empatia',
        },
      ],
    },
  },
  {
    id: 'course-004',
    title: 'Manuseio e Segurança de Produtos Químicos',
    description: 'Aprenda os procedimentos adequados para manusear e armazenar produtos químicos com segurança.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
    tags: ['Segurança', 'Químicos'],
    quiz: {
      questions: [
        {
          text: 'O que significa FISPQ?',
          options: ['Ficha de Informações de Segurança de Produtos Químicos', 'Sistema de Entrega Segura', 'Armazenamento Seguro de Dados', 'Triagem Sistemática de Drogas'],
          correctAnswer: 'Ficha de Informações de Segurança de Produtos Químicos',
        },
      ],
    },
  },
  {
    id: 'course-005',
    title: 'Excelência no Atendimento ao Cliente',
    description: 'Técnicas para fornecer um atendimento excepcional ao cliente e lidar com situações difíceis.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
    tags: ['Soft Skills', 'Atendimento ao Cliente'],
    quiz: {
      questions: [
        {
          text: 'Qual é o modelo "LAST" para lidar com reclamações?',
          options: ['Listen, Apologize, Solve, Thank (Ouvir, Pedir desculpas, Resolver, Agradecer)', 'Leave, Avoid, Stay, Talk', 'Listen, Argue, Sell, Terminate', 'Look, Act, Shout, Tell'],
          correctAnswer: 'Listen, Apologize, Solve, Thank (Ouvir, Pedir desculpas, Resolver, Agradecer)',
        },
      ],
    },
  },
  {
    id: 'course-006',
    title: 'Fundamentos de Logística e Cadeia de Suprimentos',
    description: 'Uma introdução aos fundamentos da logística moderna e gestão da cadeia de suprimentos.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
    tags: ['Logística', 'Iniciante'],
    quiz: {
      questions: [
        {
          text: 'Qual é um componente chave de uma cadeia de suprimentos?',
          options: ['Marketing', 'Compras', 'Recursos Humanos', 'Vendas'],
          correctAnswer: 'Compras',
        },
      ],
    },
  }
];
