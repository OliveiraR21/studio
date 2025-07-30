
import type { User, Module } from './types';

const today = new Date();
const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(today.getDate() - 5);
const oneYearAgo = new Date();
oneYearAgo.setFullYear(today.getFullYear() - 1);


export const users: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: '123456',
    role: 'Admin',
    area: 'TI',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
    hasCompletedOnboarding: true,
  },
  {
    id: '2',
    name: 'Eliandro Arena',
    email: 'eliandro.arena@example.com',
    password: '123456',
    role: 'Diretor',
    area: 'Diretoria',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
  },
  {
    id: '3',
    name: 'Beatriz Gerente',
    email: 'beatriz.gerente@example.com',
    password: '123456',
    role: 'Gerente',
    diretor: 'Eliandro Arena',
    area: 'Comercial',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
  },
  {
    id: '4',
    name: 'Fernanda Coordenadora',
    email: 'fernanda.coordenadora@example.com',
    password: '123456',
    role: 'Coordenador',
    gerente: 'Beatriz Gerente',
    diretor: 'Eliandro Arena',
    area: 'Comercial',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
  },
  {
    id: '5',
    name: 'Ricardo Supervisor',
    email: 'ricardo.supervisor@example.com',
    password: '123456',
    role: 'Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Eliandro Arena',
    area: 'Comercial',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
  },
  {
    id: '6',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '123456',
    role: 'Analista',
    supervisor: 'Ricardo Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Eliandro Arena',
    area: 'Comercial',
    completedCourses: [],
    courseScores: [],
    completedTracks: [],
  },
  {
    id: '7',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: '123456',
    role: 'Assistente',
    supervisor: 'Ricardo Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Eliandro Arena',
    area: 'Comercial',
    completedCourses: [],
    completedTracks: [],
  },
   {
    id: '8',
    name: 'Emily White',
    email: 'emily.white@example.com',
    password: '123456',
    role: 'Analista',
    supervisor: 'Ricardo Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Eliandro Arena',
    area: 'Logística',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
  },
  {
    id: '9',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    password: '123456',
    role: 'Assistente',
    supervisor: 'Ricardo Supervisor',
    coordenador: 'Fernanda Coordenadora',
    gerente: 'Beatriz Gerente',
    diretor: 'Eliandro Arena',
    area: 'Logística',
    completedCourses: [],
    completedTracks: [],
  },
];

export const learningModules: Module[] = [
  {
    id: 'module-integration',
    title: 'Integração',
    description: 'Vídeos de integração para novos colaboradores da Br Supply.',
    tracks: [
      {
        id: 'track-integration-main',
        moduleId: 'module-integration',
        title: 'Integração de Novos Colaboradores',
        description: 'Conheça a cultura e os processos comerciais da Br Supply.',
        order: 1,
        courses: [
          {
            id: 'course-integ-1',
            moduleId: 'module-integration',
            trackId: 'track-integration-main',
            title: 'Boas-vindas à Br Supply',
            description: 'Uma mensagem de boas-vindas do nosso CEO e uma introdução à nossa cultura e valores.',
            order: 1,
            videoUrl: 'https://app.heygen.com/embeds/603bafc3779141ec87c7eb529ce6452d',
            durationInSeconds: 90,
            thumbnailUrl: '/BrSupply.png',
            createdAt: new Date(),
            likes: 0,
            dislikes: 0,
          },
           {
            id: 'course-integ-2',
            moduleId: 'module-integration',
            trackId: 'track-integration-main',
            title: 'Integração Comercial',
            description: 'Um tour pelas principais ferramentas e recursos da nossa plataforma de e-learning.',
            order: 2,
            videoUrl: 'https://app.heygen.com/embeds/f508152b4abc46f2b5f135fba44b31cb',
            durationInSeconds: 120,
            thumbnailUrl: '/BrSupply.png',
            createdAt: new Date(),
            likes: 0,
            dislikes: 0,
          }
        ],
      },
    ]
  },
  {
    id: 'module-hs',
    title: 'Hard Skills',
    description: 'Desenvolva competências técnicas e operacionais essenciais para sua função.',
    tracks: [
      {
        id: 'track-hs-pe',
        moduleId: 'module-hs',
        title: 'Planejamento de Estoques',
        order: 1,
        description: 'Aprenda a otimizar os níveis de estoque para garantir a disponibilidade de produtos.',
        courses: [],
      },
      {
        id: 'track-hs-cp',
        moduleId: 'module-hs',
        title: 'Ciclo do Pedido',
        order: 2,
        description: 'Entenda todas as etapas do ciclo de vida de um pedido, da criação à entrega.',
        courses: []
      },
      {
        id: 'track-hs-pnc',
        order: 3,
        moduleId: 'module-hs',
        title: 'Pedidos Não Conformes',
        description: 'Saiba como identificar, tratar e prevenir pedidos que não seguem os padrões.',
        courses: []
      },
      {
        id: 'track-hs-co',
        order: 4,
        moduleId: 'module-hs',
        title: 'Cadastros Operacionais',
        description: 'Domine os processos de cadastro que são a base para as operações da empresa.',
        courses: []
      },
      {
        id: 'track-hs-fat',
        order: 5,
        moduleId: 'module-hs',
        title: 'Faturamento',
        description: 'Compreenda o processo de faturamento, desde a emissão da nota até a contabilização.',
        courses: []
      },
      {
        id: 'track-hs-inad',
        order: 6,
        moduleId: 'module-hs',
        title: 'Inadimplência',
        description: 'Aprenda a gerenciar e reduzir os índices de inadimplência dos clientes.',
        courses: []
      },
      {
        id: 'track-hs-sc',
        order: 7,
        moduleId: 'module-hs',
        title: 'Satisfação de Clientes',
        description: 'Desenvolva técnicas para medir e melhorar a satisfação dos nossos clientes.',
        courses: []
      },
      {
        id: 'track-hs-mb',
        order: 8,
        moduleId: 'module-hs',
        title: 'Margem Bruta (MB)',
        description: 'Entenda como calcular e analisar a margem bruta para a tomada de decisões.',
        courses: []
      },
      {
        id: 'track-hs-com',
        moduleId: 'module-hs',
        title: 'Comunicação',
        description: 'Aprimore suas habilidades de comunicação para interações mais eficazes.',
        order: 9,
        courses: []
      },
      {
        id: 'track-hs-cv',
        order: 10,
        moduleId: 'module-hs',
        title: 'Comunicação Verbal',
        description: 'Desenvolva suas habilidades de comunicação verbal para apresentações e interações eficazes.',
        courses: [],
      },
      {
        id: 'track-hs-ce',
        order: 11,
        moduleId: 'module-hs',
        title: 'Comunicação Escrita',
        description: 'Aprimore sua escrita para e-mails, relatórios e outros documentos profissionais.',
        courses: [],
      },
      {
        id: 'track-hs-if',
        order: 12,
        moduleId: 'module-hs',
        title: 'Inteligência Fiscal',
        description: 'Compreenda a legislação tributária e otimize a gestão fiscal da empresa.',
        courses: []
      },
    ]
  },
  {
    id: 'module-ss',
    title: 'Soft Skills',
    description: 'Aprimore suas habilidades interpessoais, de comunicação e liderança.',
    tracks: [
      {
        id: 'track-ss-lid',
        order: 1,
        moduleId: 'module-ss',
        title: 'Liderança',
        description: 'Desenvolva habilidades para inspirar, motivar e guiar equipes ao sucesso.',
        courses: []
      },
      {
        id: 'track-ss-te',
        order: 2,
        moduleId: 'module-ss',
        title: 'Trabalho em Equipe',
        description: 'Aprenda a colaborar de forma eficaz, promovendo um ambiente produtivo e harmonioso.',
        courses: []
      },
      {
        id: 'track-ss-ie',
        order: 3,
        moduleId: 'module-ss',
        title: 'Inteligência Emocional',
        description: 'Gerencie suas emoções e entenda as dos outros para construir relacionamentos mais fortes.',
        courses: []
      },
      {
        id: 'track-ss-pc',
        order: 4,
        moduleId: 'module-ss',
        title: 'Pensamento Crítico',
        description: 'Desenvolva a capacidade de analisar informações e tomar decisões baseadas em lógica.',
        courses: []
      },
      {
        id: 'track-ss-in',
        order: 5,
        moduleId: 'module-ss',
        title: 'Inovação',
        description: 'Aprenda a gerar e implementar novas ideias para resolver problemas e criar valor.',
        courses: []
      },
      {
        id: 'track-ss-or',
        order: 6,
        moduleId: 'module-ss',
        title: 'Orientação para Resultados',
        description: 'Mantenha o foco em metas e objetivos para alcançar resultados excepcionais.',
        courses: []
      },
    ]
  },
  {
    id: 'module-hms',
    title: 'Human-Machine Skills',
    description: 'Aprenda a colaborar de forma eficaz com tecnologias e sistemas automatizados.',
    tracks: [
      {
        id: 'track-hms-intro',
        order: 1,
        moduleId: 'module-hms',
        title: 'Introdução',
        description: 'Conceitos fundamentais sobre a colaboração entre humanos e inteligência artificial.',
        courses: []
      },
      {
        id: 'track-hms-lial',
        order: 2,
        moduleId: 'module-hms',
        title: 'Literacia de IA para Líderes',
        description: 'Entenda o potencial da IA para tomar decisões estratégicas na liderança.',
        courses: []
      },
      {
        id: 'track-hms-pe',
        order: 3,
        moduleId: 'module-hms',
        title: 'Prompt Engineering',
        description: 'Aprenda a arte de criar instruções eficazes para obter os melhores resultados de IAs generativas.',
        courses: []
      },
      {
        id: 'track-hms-iacs',
        order: 4,
        moduleId: 'module-hms',
        title: 'IA e Cybersecurity',
        description: 'Descubra como a IA está transformando a segurança digital, tanto na defesa quanto nas ameaças.',
        courses: []
      },
      {
        id: 'track-hms-ait',
        order: 5,
        moduleId: 'module-hms',
        title: 'AI Tools',
        description: 'Explore uma gama de ferramentas de IA para aumentar a produtividade no dia a dia.',
        courses: []
      },
      {
        id: 'track-hms-cp',
        order: 6,
        moduleId: 'module-hms',
        title: 'Copilot',
        description: 'Domine o Microsoft Copilot para otimizar suas tarefas no ambiente de trabalho.',
        courses: []
      },
    ]
  }
];
