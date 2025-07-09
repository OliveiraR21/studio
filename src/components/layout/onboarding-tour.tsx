'use client';

import { useState, useEffect } from 'react';
import Joyride, { type Step, type CallBackProps } from 'react-joyride';
import type { User } from '@/lib/types';
import { useTour } from '@/hooks/use-tour';

interface OnboardingTourProps {
  user: User;
}

export function OnboardingTour({ user }: OnboardingTourProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { run, stopTour } = useTour();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const managerRoles = ['Supervisor', 'Coordenador', 'Gerente', 'Diretor'];
  const isManager = user && managerRoles.includes(user.role);
  const isAdmin = user && user.role === 'Admin';

  let steps: Step[] = [
    {
      content:
        'Boas-vindas à Academia Br Supply! Vamos fazer um tour rápido pela plataforma.',
      placement: 'center',
      target: 'body',
    },
    {
      target: '[data-tour-id="meu-painel"]',
      content:
        'Este é o seu Painel de Controle. Aqui você visualiza rapidamente sua evolução nos cursos, sua média geral, e o mais importante: quais cursos precisam ser refeitos para atingir a nota mínima.',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="meus-cursos"]',
      content:
        'Aqui fica sua jornada de aprendizado. Os cursos são organizados em Módulos (grandes áreas) e Trilhas (sequências de aulas). Você precisa concluir um curso para desbloquear o próximo, seguindo um caminho lógico de conhecimento.',
    },
  ];

  if (isManager || isAdmin) {
    steps.push({
      target: '[data-tour-id="minha-equipe"]',
      content:
        'Como gestor, esta área é sua ferramenta para acompanhar o progresso de sua equipe. Você pode visualizar o desempenho individual e geral, ajudando no desenvolvimento do time.',
    });
  }

  if (isAdmin) {
    steps.push({
      target: '[data-tour-id="area-de-administracao"]',
      content: 'Como Administrador, você tem acesso total. A partir daqui, você pode gerenciar usuários, criar e organizar os módulos, trilhas e todos os cursos da plataforma.'
    });
  }

  steps.push(
    {
      target: '[data-tour-id="notification-bell"]',
      content:
        'Fique de olho no sino para receber notificações sobre novos cursos e lembretes importantes.',
    },
    {
      target: '[data-tour-id="user-nav"]',
      content:
        'No seu perfil, você pode ver suas informações, alterar configurações e sair da plataforma.',
    },
    {
      target: '[data-tour-id="preciso-de-ajuda"]',
      content:
        'Se tiver qualquer dúvida, o menu de ajuda tem um guia completo sobre todas as funcionalidades. Você também pode refazer este tour a qualquer momento por lá.',
    }
  );

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      stopTour();
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular',
      }}
      styles={{
        options: {
          arrowColor: 'hsl(var(--card))',
          backgroundColor: 'hsl(var(--card))',
          overlayColor: 'rgba(0, 0, 0, 0.8)',
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--card-foreground))',
          zIndex: 1000,
        },
        buttonClose: {
          display: 'none',
        },
      }}
    />
  );
}
