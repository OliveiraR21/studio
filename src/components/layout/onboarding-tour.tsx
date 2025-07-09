
'use client';

import { useState, useEffect } from 'react';
import Joyride, { type Step, type CallBackProps } from 'react-joyride';
import type { User } from '@/lib/types';

interface OnboardingTourProps {
    user: User;
}

const TOUR_STORAGE_KEY = 'brsupply-tour-completed-v1';

export function OnboardingTour({ user }: OnboardingTourProps) {
  const [run, setRun] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This ensures all logic runs only on the client, after the component has mounted.
    setIsMounted(true);
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      setRun(true);
    }
  }, []);

  const managerRoles = ['Supervisor', 'Coordenador', 'Gerente', 'Diretor', 'Admin'];
  const isManagerOrAdmin = user && managerRoles.includes(user.role);

  const baseSteps: Step[] = [
    {
      content: 'Boas-vindas à Academia Br Supply! Vamos fazer um tour rápido pela plataforma.',
      placement: 'center',
      target: 'body',
    },
    {
      target: '[data-tour-id="meu-painel"]',
      content: 'Aqui no "Meu Painel", você encontra um resumo do seu progresso, sua média e suas pendências.',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="meus-cursos"]',
      content: 'Em "Meus Cursos", você acessa todas as trilhas de conhecimento e cursos disponíveis para você.',
    },
  ];

  if (isManagerOrAdmin) {
    baseSteps.push({
      target: '[data-tour-id="minha-equipe"]',
      content: 'Como gestor, aqui você pode acompanhar o desenvolvimento e o desempenho da sua equipe.',
    });
  }

  const finalSteps: Step[] = [
    {
      target: '[data-tour-id="notification-bell"]',
      content: 'Fique de olho no sino para receber notificações sobre novos cursos e lembretes importantes.',
    },
    {
      target: '[data-tour-id="user-nav"]',
      content: 'No seu perfil, você pode ver suas informações, alterar configurações e sair da plataforma.',
    },
    {
      target: '[data-tour-id="preciso-de-ajuda"]',
      content: 'Se tiver qualquer dúvida, o menu de ajuda tem um guia completo sobre todas as funcionalidades.',
    },
  ];
  
  const steps = [...baseSteps, ...finalSteps];


  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      setRun(false);
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
