'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SacredAlert } from '@/components/SacredAlert';
import { SacredToast } from '@/components/SacredToast';

interface SacredDataContextType {
  showAlert: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const SacredDataContext = createContext<SacredDataContextType | undefined>(undefined);

export const useSacredData = () => {
  const context = useContext(SacredDataContext);
  if (!context) {
    throw new Error('useSacredData must be used within a SacredDataProvider');
  }
  return context;
};

interface SacredDataProviderProps {
  children: ReactNode;
}

export const SacredDataProvider = ({ children }: SacredDataProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  const showAlert = useCallback(
    (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
      setAlert({ type, message });
      setTimeout(() => setAlert(null), 5000);
    },
    []
  );

  const showToast = useCallback(
    (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
      setToast({ type, message });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  return (
    <SacredDataContext.Provider
      value={{
        showAlert,
        showToast,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <SacredAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <SacredToast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            isVisible={true}
          />
        </div>
      )}
    </SacredDataContext.Provider>
  );
};
