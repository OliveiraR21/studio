
'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  createElement,
} from 'react';
import type { User } from '@/lib/types';
import { completeOnboardingForUser } from '@/actions/user-actions';


interface TourContextType {
  run: boolean;
  startTour: () => void;
  stopTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ user, children }: { user: User, children: ReactNode }) {
  const [run, setRun] = useState(false);

  // Check on mount if the tour should run automatically based on the user's DB flag.
  useEffect(() => {
    // We only run the tour if the user object is available and the flag is not set.
    if (user && !user.hasCompletedOnboarding) {
      setRun(true);
    }
  }, [user]);

  const startTour = () => {
    // We set the state to false first to ensure Joyride remounts/restarts if it was somehow stuck.
    // Then in a timeout, we set it to true.
    setRun(false);
    setTimeout(() => setRun(true), 100);
  };

  const stopTour = () => {
    // This now calls a server action to permanently mark the tour as completed for the user.
    completeOnboardingForUser();
    setRun(false);
  };

  return createElement(
    TourContext.Provider,
    { value: { run, startTour, stopTour } },
    children
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
