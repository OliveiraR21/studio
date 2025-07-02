import type { User, Module } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Admin',
    area: 'TI',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
  },
  {
    id: '2',
    name: 'Carlos Diretor',
    email: 'carlos.diretor@example.com',
    role: 'Diretor',
    area: 'Diretoria',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
  },
  {
    id: '3',
    name: 'Beatriz Gerente',
    email: 'beatriz.gerente@example.com',
    role: 'Gerente',
    diretor: 'Carlos Diretor',
    area: 'Comercial',
    avatarUrl: 'https://placehold.co/100x100.png',
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
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
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
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
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
    trackScores: [],
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
    courseScores: [],
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
    completedCourses: [],
    completedTracks: [],
    courseScores: [],
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
        id: 'track-hs-pe',
        moduleId: 'module-hs',
        title: 'Planejamento de Estoques',
        description: 'Aprenda a otimizar os níveis de estoque para garantir a disponibilidade de produtos.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hs-cp',
        moduleId: 'module-hs',
        title: 'Ciclo do Pedido',
        description: 'Entenda todas as etapas do ciclo de vida de um pedido, da criação à entrega.',
        courses: [
          {
            id: 'course-brs-portal-training',
            moduleId: 'module-hs',
            trackId: 'track-hs-cp',
            title: 'Treinamento Portal | BRS',
            description: 'Aprenda a navegar e utilizar o portal BRS para gerenciar o ciclo de pedidos de forma eficiente, desde a criação até o acompanhamento da entrega.',
            videoUrl: 'https://app.heygen.com/embeds/bd56c8797da44842a812774797b10fbd',
            durationInSeconds: 300,
            quiz: {
              questions: [
                {
                  text: "Qual é o primeiro passo para criar um pedido no portal BRS?",
                  options: [
                    "Inserir o CNPJ do cliente",
                    "Selecionar o tipo de frete",
                    "Adicionar produtos ao carrinho",
                    "Definir a data de entrega"
                  ],
                  correctAnswer: "Inserir o CNPJ do cliente"
                },
                {
                  text: "Qual informação NÃO é necessária para a busca de clientes no portal?",
                  options: [
                    "CNPJ",
                    "Código do cliente",
                    "Nome da empresa",
                    "Endereço de e-mail do comprador"
                  ],
                  correctAnswer: "Endereço de e-mail do comprador"
                },
                {
                  text: "O que o sistema faz após você inserir um CNPJ válido?",
                  options: [
                    "Envia o pedido automaticamente",
                    "Carrega os dados da empresa e as opções de entrega",
                    "Pede para confirmar o e-mail",
                    "Mostra o histórico de compras"
                  ],
                  correctAnswer: "Carrega os dados da empresa e as opções de entrega"
                },
                {
                  text: "Qual é o propósito da aba 'Acompanhamento' no portal?",
                  options: [
                    "Para cadastrar novos produtos",
                    "Para visualizar o status de todos os pedidos feitos",
                    "Para alterar a senha de acesso",
                    "Para entrar em contato com o suporte"
                  ],
                  correctAnswer: "Para visualizar o status de todos os pedidos feitos"
                },
                {
                  text: "Qual das opções de frete mencionadas é de responsabilidade do cliente?",
                  options: [
                    "CIF",
                    "FOB",
                    "Entrega Expressa",
                    "Todas as anteriores"
                  ],
                  correctAnswer: "FOB"
                }
              ]
            }
          }
        ],
        quiz: { questions: [] }
      },
      {
        id: 'track-hs-pnc',
        moduleId: 'module-hs',
        title: 'Pedidos Não Conformes',
        description: 'Saiba como identificar, tratar e prevenir pedidos que não seguem os padrões.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hs-co',
        moduleId: 'module-hs',
        title: 'Cadastros Operacionais',
        description: 'Domine os processos de cadastro que são a base para as operações da empresa.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hs-fat',
        moduleId: 'module-hs',
        title: 'Faturamento',
        description: 'Compreenda o processo de faturamento, desde a emissão da nota até a contabilização.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hs-inad',
        moduleId: 'module-hs',
        title: 'Inadimplência',
        description: 'Aprenda a gerenciar e reduzir os índices de inadimplência dos clientes.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hs-sc',
        moduleId: 'module-hs',
        title: 'Satisfação de Clientes',
        description: 'Desenvolva técnicas para medir e melhorar a satisfação dos nossos clientes.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hs-mb',
        moduleId: 'module-hs',
        title: 'Margem Bruta (MB)',
        description: 'Entenda como calcular e analisar a margem bruta para a tomada de decisões.',
        courses: [],
        quiz: { questions: [] }
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
        moduleId: 'module-ss',
        title: 'Liderança',
        description: 'Desenvolva habilidades para inspirar, motivar e guiar equipes ao sucesso.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-ss-te',
        moduleId: 'module-ss',
        title: 'Trabalho em Equipe',
        description: 'Aprenda a colaborar de forma eficaz, promovendo um ambiente produtivo e harmonioso.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-ss-ie',
        moduleId: 'module-ss',
        title: 'Inteligência Emocional',
        description: 'Gerencie suas emoções e entenda as dos outros para construir relacionamentos mais fortes.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-ss-pc',
        moduleId: 'module-ss',
        title: 'Pensamento Crítico',
        description: 'Desenvolva a capacidade de analisar informações e tomar decisões baseadas em lógica.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-ss-in',
        moduleId: 'module-ss',
        title: 'Inovação',
        description: 'Aprenda a gerar e implementar novas ideias para resolver problemas e criar valor.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-ss-or',
        moduleId: 'module-ss',
        title: 'Orientação para Resultados',
        description: 'Mantenha o foco em metas e objetivos para alcançar resultados excepcionais.',
        courses: [],
        quiz: { questions: [] }
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
        moduleId: 'module-hms',
        title: 'Introdução',
        description: 'Conceitos fundamentais sobre a colaboração entre humanos e inteligência artificial.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hms-lial',
        moduleId: 'module-hms',
        title: 'Literacia de IA para Líderes',
        description: 'Entenda o potencial da IA para tomar decisões estratégicas na liderança.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hms-pe',
        moduleId: 'module-hms',
        title: 'Prompt Engineering',
        description: 'Aprenda a arte de criar instruções eficazes para obter os melhores resultados de IAs generativas.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hms-iacs',
        moduleId: 'module-hms',
        title: 'IA e Cybersecurity',
        description: 'Descubra como a IA está transformando a segurança digital, tanto na defesa quanto nas ameaças.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hms-ait',
        moduleId: 'module-hms',
        title: 'AI Tools',
        description: 'Explore uma gama de ferramentas de IA para aumentar a produtividade no dia a dia.',
        courses: [],
        quiz: { questions: [] }
      },
      {
        id: 'track-hms-cp',
        moduleId: 'module-hms',
        title: 'Copilot',
        description: 'Domine o Microsoft Copilot para otimizar suas tarefas no ambiente de trabalho.',
        courses: [],
        quiz: { questions: [] }
      },
    ]
  }
];
