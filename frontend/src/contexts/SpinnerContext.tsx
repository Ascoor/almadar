import { createContext, useContext, useState, ReactNode } from 'react';

type SpinnerContextType = {
  isLoading: boolean;
  showSpinner: () => void;
  hideSpinner: () => void;
  setLoading: (loading: boolean) => void;
};

const SpinnerContext = createContext<SpinnerContextType | null>(null);

interface SpinnerProviderProps {
  children: ReactNode;
}

export function SpinnerProvider({ children }: SpinnerProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const showSpinner = () => setIsLoading(true);
  const hideSpinner = () => setIsLoading(false);
  const setLoading = (loading: boolean) => setIsLoading(loading);

  return (
    <SpinnerContext.Provider value={{
      isLoading,
      showSpinner,
      hideSpinner,
      setLoading,
    }}>
      {children}
    </SpinnerContext.Provider>
  );
}

export const useSpinnerContext = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('useSpinnerContext must be used within a SpinnerProvider');
  }
  return context;
};