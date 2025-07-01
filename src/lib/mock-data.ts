import type { User, Module } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Admin',
    area: 'TI',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: ['course-hs-vt-1'],
    completedTracks: [],
    courseScores: [
      { courseId: 'course-hs-vt-1', score: 95, attempts: 1 },
      { courseId: 'course-ss-li-1', score: 100, attempts: 1 },
    ],
    trackScores: [
      { trackId: 'track-hs-vt', score: 98, attempts: 1 },
    ],
  },
  {
    id: '2',
    name: 'Carlos Diretor',
    email: 'carlos.diretor@example.com',
    role: 'Diretor',
    area: 'Diretoria',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: ['course-hs-vt-1'],
    completedTracks: [],
    courseScores: [
      { courseId: 'course-hs-vt-1', score: 100, attempts: 1 },
    ],
  },
  {
    id: '3',
    name: 'Beatriz Gerente',
    email: 'beatriz.gerente@example.com',
    role: 'Gerente',
    diretor: 'Carlos Diretor',
    area: 'Comercial',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: ['course-hs-vt-1'],
    completedTracks: [],
    courseScores: [{ courseId: 'course-hs-vt-1', score: 85, attempts: 1 }],
  },
  {
    id: '4',
    name: 'Fernanda Coordenadora',
    email: 'fernanda.coordenadora@example.com',
    role: 'Coordenador',
    gerente: 'Beatriz Gerente',
    diretor: 'Carlos Diretor',
    area: 'Comercial',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: ['course-hs-vt-1', 'course-ss-li-1'],
    completedTracks: [],
     courseScores: [
      { courseId: 'course-hs-vt-1', score: 90, attempts: 1 },
      { courseId: 'course-ss-li-1', score: 95, attempts: 1 },
    ],
  },
  {
    id: '5',
    name: 'Ricardo Supervisor',
    email: 'ricardo.supervisor@example.com',
    role: 'Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Carlos Diretor',
    area: 'Comercial',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: ['course-hs-vt-1', 'course-hs-vt-2'],
    completedTracks: [],
    courseScores: [
        { courseId: 'course-hs-vt-1', score: 75, attempts: 1 },
        { courseId: 'course-hs-vt-2', score: 88, attempts: 1 },
    ],
  },
  {
    id: '6',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Analista',
    supervisor: 'Ricardo Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Carlos Diretor',
    area: 'Comercial',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: [],
    courseScores: [{ courseId: 'course-hs-vt-1', score: 60, attempts: 1 }],
    completedTracks: [],
  },
  {
    id: '7',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Assistente',
    supervisor: 'Ricardo Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Carlos Diretor',
    area: 'Comercial',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: [],
    completedTracks: [],
  },
   {
    id: '8',
    name: 'Emily White',
    email: 'emily.white@example.com',
    role: 'Analista',
    supervisor: 'Ricardo Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Carlos Diretor',
    area: 'Logística',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: ['course-hs-le-2'],
    completedTracks: [],
    courseScores: [{ courseId: 'course-hs-le-2', score: 55, attempts: 2 }],
  },
  {
    id: '9',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'Assistente',
    supervisor: 'Ricardo Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Carlos Diretor',
    area: 'Logística',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: [],
    completedTracks: [],
  },
];

export const learningModules: Module[] = [
  {
    id: 'module-hs',
    title: 'Hard Skills',
    description: 'Desenvolva competências técnicas e operacionais essenciais para sua função.',
    tracks: [
      {
        id: 'track-hs-vt',
        moduleId: 'module-hs',
        title: 'Trilha de Vendas para Iniciantes',
        description: 'Aprenda os conceitos fundamentais para iniciar sua carreira na área comercial.',
        courses: [
          {
            id: 'course-hs-vt-1',
            moduleId: 'module-hs',
            trackId: 'track-hs-vt',
            title: 'Painel Comercial - Apresentação',
            description: 'Uma visão abrangente dos protocolos e procedimentos essenciais de segurança no local de trabalho.',
            videoUrl: 'https://brsupply.sharepoint.com/sites/GestoComercial/_layouts/15/embed.aspx?UniqueId=964a79a2-7f5a-470d-84eb-74f9befb8c74&embed=%7B%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create',
            quiz: {
              questions: [
                {
                  text: 'Qual é a principal função do Painel Comercial?',
                  options: ['Registrar férias', 'Analisar o desempenho de vendas', 'Enviar e-mails', 'Criar planilhas'],
                  correctAnswer: 'Analisar o desempenho de vendas',
                },
              ],
            },
          },
          {
            id: 'course-hs-vt-2',
            moduleId: 'module-hs',
            trackId: 'track-hs-vt',
            title: 'Excelência no Atendimento ao Cliente',
            description: 'Técnicas para fornecer um atendimento excepcional ao cliente e lidar com situações difíceis.',
            videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
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
        ],
        quiz: {
           questions: [
            {
              text: 'Qual a importância de um bom atendimento ao cliente?',
              options: ['Aumentar os custos', 'Fidelizar o cliente', 'Diminuir as vendas', 'Não tem importância'],
              correctAnswer: 'Fidelizar o cliente',
            },
             {
              text: 'O Painel Comercial ajuda a tomar decisões baseadas em quê?',
              options: ['Achismos', 'Dados e métricas', 'Intuição', 'Sorte'],
              correctAnswer: 'Dados e métricas',
            },
          ],
        }
      },
      {
        id: 'track-hs-le',
        moduleId: 'module-hs',
        title: 'Trilha de Logística Essencial',
        description: 'Entenda os processos que movimentam nossos produtos, desde o estoque até a entrega.',
        courses: [
           {
            id: 'course-hs-le-1',
            moduleId: 'module-hs',
            trackId: 'track-hs-le',
            title: 'Fundamentos de Logística e Cadeia de Suprimentos',
            description: 'Uma introdução aos fundamentos da logística moderna e gestão da cadeia de suprimentos.',
            videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
          },
          {
            id: 'course-hs-le-2',
            moduleId: 'module-hs',
            trackId: 'track-hs-le',
            title: 'Operação Avançada de Empilhadeira',
            description: 'Domine técnicas avançadas para uma operação segura e eficiente de empilhadeiras.',
            videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
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
            id: 'course-hs-le-3',
            moduleId: 'module-hs',
            trackId: 'track-hs-le',
            title: 'Manuseio e Segurança de Produtos Químicos',
            description: 'Aprenda os procedimentos adequados para manusear e armazenar produtos químicos com segurança.',
            videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
          },
        ],
        quiz: {
           questions: [
            {
              text: 'O que é um componente chave da cadeia de suprimentos?',
              options: ['Marketing', 'Compras', 'Recursos Humanos', 'Vendas'],
              correctAnswer: 'Compras',
            },
          ],
        }
      },
    ]
  },
  {
    id: 'module-ss',
    title: 'Soft Skills',
    description: 'Aprimore suas habilidades interpessoais, de comunicação e liderança.',
    tracks: [
       {
        id: 'track-ss-li',
        moduleId: 'module-ss',
        title: 'Trilha de Liderança',
        description: 'Desenvolva habilidades de liderança essenciais para gerenciar e motivar sua equipe de forma eficaz.',
        courses: [
          {
            id: 'course-ss-li-1',
            moduleId: 'module-ss',
            trackId: 'track-ss-li',
            title: 'Liderança e Gestão de Equipes',
            description: 'Desenvolva habilidades de liderança essenciais para gerenciar e motivar sua equipe de forma eficaz.',
            videoUrl: 'https://www.youtube.com/embed/1T312yT6-yA',
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
        ],
        quiz: {
           questions: [
            {
              text: 'A empatia é crucial para a liderança porque...',
              options: ['Ajuda a controlar a equipe', 'Permite entender e se conectar com as pessoas', 'Não é importante', 'Facilita a punição'],
              correctAnswer: 'Permite entender e se conectar com as pessoas',
            },
          ],
        }
      },
    ]
  },
  {
    id: 'module-hms',
    title: 'Human-Machine Skills',
    description: 'Aprenda a colaborar de forma eficaz com tecnologias e sistemas automatizados.',
    tracks: []
  }
];
