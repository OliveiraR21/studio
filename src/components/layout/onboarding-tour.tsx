
'use client';

import { useState, useEffect, useRef } from 'react';
import Joyride, { type Step, type CallBackProps, type EVENTS } from 'react-joyride';
import type { User } from '@/lib/types';
import { useTour } from '@/hooks/use-tour';

interface OnboardingTourProps {
  user: User;
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
    const { status, step, type, action } = data;
    const finishedStatuses: string[] = ['finished', 'skipped'];

    // Limpa a classe do alvo anterior
    if (lastTarget.current) {
        lastTarget.current.classList.remove('joyride-active-step');
    }

    if (finishedStatuses.includes(status)) {
      stopTour();
      return;
    }

    if (type === EVENTS.STEP_AFTER || (type === EVENTS.TOOLTIP && action === 'close')) {
        const currentTarget = step.target === 'body' ? null : document.querySelector<HTMLElement>(step.target as string);
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
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            transition: 'box-shadow 0.2s ease-in-out',
        },
        tooltip: {
          borderRadius: 'var(--radius)',
        },
      }}
      tooltipOptions={{
        modifiers: [
            {
                name: 'applyStyles',
                fn: (data) => {
                    const nextButton = data.state.elements.popper.querySelector<HTMLButtonElement>('.__floater__button-primary');
                    if (nextButton) {
                        nextButton.onmouseenter = () => {
                            nextButton.style.boxShadow = '0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))';
                        };
                        nextButton.onmouseleave = () => {
                            nextButton.style.boxShadow = 'none';
                        };
                    }
                }
            }
        ]
      }}
      floaterProps={{
        styles: {
          arrow: {
            length: 8,
            spread: 12,
          }
        }
      }}
    />
  );
}
