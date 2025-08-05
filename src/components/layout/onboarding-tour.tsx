
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Joyride, { type Step, type CallBackProps, EVENTS } from 'react-joyride';
import type { User } from '@/lib/types';
import { useTour } from '@/hooks/use-tour';
import { Button } from '@/components/ui/button';
import { AnimatedSupply } from './animated-supply';
import { Skeleton } from '../ui/skeleton';

interface OnboardingTourProps {
  user: User;
}

// Create a separate component to isolate the Suspense boundary
function TourAvatar() {
  return (
    <Suspense fallback={<Skeleton className="w-28 h-28 rounded-full" />}>
      <AnimatedSupply />
    </Suspense>
  );
}


export function OnboardingTour({ user }: OnboardingTourProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { run, stopTour } = useTour();
  const lastTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const managerRoles = ['Supervisor', 'Coordenador', 'Gerente', 'Diretor'];
  const isManager = user && managerRoles.includes(user.role);
  const isAdmin = user && user.role === 'Admin';

  let steps: Step[] = [
    {
      content:
        'Boas-vindas à BRS Academy! Eu sou o Supply, seu guia. Vamos fazer um tour rápido pela plataforma.',
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
        'Precisa de ajuda? Clique aqui para rever o guia ou refazer este tour a qualquer momento.',
    }
  );

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, step, type, action } = data;
    const finishedStatuses: string[] = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      if (lastTarget.current) {
        lastTarget.current.classList.remove('joyride-active-step');
      }
      stopTour();
      return;
    }

    if (type === EVENTS.STEP_AFTER || (type === EVENTS.TOOLTIP && action === 'close')) {
      const currentTarget = step.target === 'body' ? null : document.querySelector<HTMLElement>(step.target as string);
      
      if (lastTarget.current && lastTarget.current !== currentTarget) {
        lastTarget.current.classList.remove('joyride-active-step');
      }

      if (currentTarget) {
        currentTarget.classList.add('joyride-active-step');
        lastTarget.current = currentTarget;
      }
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
        next: 'Avançar',
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
      tooltipComponent={({
        continuous,
        index,
        step,
        backProps,
        primaryProps,
        tooltipProps,
      }) => (
        <div {...tooltipProps} className="p-4 rounded-lg bg-card text-card-foreground shadow-lg max-w-xs flex gap-4">
          <div className="flex-shrink-0 w-28 h-28">
            <TourAvatar />
          </div>
          <div className="flex-grow">
            <div className="text-sm">{step.content}</div>
            <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-muted-foreground">{index + 1} de {steps.length}</span>
                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <Button {...backProps} variant="ghost" size="sm">
                      Voltar
                    </Button>
                  )}
                  <Button {...primaryProps} size="sm" className="joyride-next-button">
                      {continuous ? 'Avançar' : 'Finalizar'}
                  </Button>
                </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
