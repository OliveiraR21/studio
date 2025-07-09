'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

interface TourContextType {
  run: boolean;
  startTour: () => void;
  stopTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);
const TOUR_STORAGE_KEY = 'brsupply-tour-completed-v1';

export function TourProvider({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(false);

  // Check on mount if the tour should run automatically.
  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      setRun(true);
    }
  }, []);

  const startTour = () => {
    // We set the state to false first to ensure Joyride remounts/restarts if it was somehow stuck.
    // Then in a timeout, we set it to true.
    setRun(false);
    setTimeout(() => setRun(true), 100);
  };

  const stopTour = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setRun(false);
  };

  return (
    <TourContext.Provider value={{ run, startTour, stopTour }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
