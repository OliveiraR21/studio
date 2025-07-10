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
        'Este é o seu Painel. Acompanhe seu progresso e notas aqui.',
      disableBeacon: true,
    },
    {
      target: '[data-tour-id="meus-cursos"]',
      content:
        'Em "Meus Cursos", você acessa suas trilhas de conhecimento e aulas.',
    },
  ];

  if (isManager || isAdmin) {
    steps.push({
      target: '[data-tour-id="minha-equipe"]',
      content:
        'Como gestor, use esta área para ver o progresso da sua equipe.',
    });
  }

  if (isAdmin) {
    steps.push({
      target: '[data-tour-id="area-de-administracao"]',
      content: 'Como Admin, aqui você gerencia usuários, trilhas e cursos.',
    });
  }

  steps.push(
    {
      target: '[data-tour-id="notification-bell"]',
      content:
        'O sino mostra notificações sobre novos cursos e lembretes.',
    },
    {
      target: '[data-tour-id="user-nav"]',
      content:
        'Clique no seu avatar para ver seu perfil ou sair.',
    },
    {
      target: '[data-tour-id="preciso-de-ajuda"]',
      content:
        'Precisa de ajuda? Clique aqui para rever o guia ou refazer este tour.',
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
      showProgress={false}
      showSkipButton
      steps={steps}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Next',
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
        buttonNext: {
            fontSize: '14px',
            padding: '8px 16px',
        },
        spotlight: {
          borderRadius: 'var(--radius)',
        },
        tooltip: {
          borderRadius: 'var(--radius)',
        },
      }}
      floaterProps={{
        styles: {
          arrow: {
            length: 8,
            spread: 12,
          }
        }
      }}
      tooltipComponent={({
        continuous,
        index,
        step,
        backProps,
        closeProps,
        primaryProps,
        tooltipProps,
      }) => (
        <div {...tooltipProps} className="joyride-tooltip bg-card text-card-foreground p-4 rounded-lg shadow-lg max-w-xs">
          {step.title && <h4 className="font-bold text-lg mb-2">{step.title}</h4>}
          <div className="text-sm">{step.content}</div>
          <div className="flex justify-end items-center mt-4">
             {index > 0 && (
              <button {...backProps} className="text-xs text-muted-foreground mr-4">
                {step.locale?.back}
              </button>
            )}
            {continuous && (
              <button {...primaryProps} className="joyride-next-button rounded-md font-semibold">
                {step.locale?.next}
              </button>
            )}
            {!continuous && (
              <button {...closeProps} className="joyride-next-button rounded-md font-semibold">
                {step.locale?.close}
              </button>
            )}
          </div>
        </div>
      )}
    />
  );
}
