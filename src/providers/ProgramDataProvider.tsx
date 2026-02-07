'use client';

import { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import StatusAlert from '@/components/StatusAlert';
import StatusToast from '@/components/StatusToast';

type ProgramMessageKind = 'success' | 'error' | 'warning' | 'info';

interface ProgramDataContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  showAlert: (kind: ProgramMessageKind, message: string) => void;
  showToast: (kind: ProgramMessageKind, message: string) => void;
}

const ProgramDataContext = createContext<ProgramDataContextType | undefined>(undefined);

export function useProgramData() {
  const context = useContext(ProgramDataContext);
  if (!context) {
    throw new Error('useProgramData must be used within a ProgramDataProvider');
  }
  return context;
}

interface ProgramDataProviderProps {
  children: ReactNode;
}

export function ProgramDataProvider({ children }: ProgramDataProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ kind: ProgramMessageKind; message: string } | null>(null);
  const [toast, setToast] = useState<{ kind: ProgramMessageKind; message: string } | null>(null);

  const showAlert = useCallback((kind: ProgramMessageKind, message: string) => {
    setAlert({ kind, message });
    setTimeout(() => setAlert(null), 5000);
  }, []);

  const showToast = useCallback((kind: ProgramMessageKind, message: string) => {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ProgramDataContext.Provider
      value={{ isLoading, setIsLoading, error, setError, showAlert, showToast }}
    >
      {children}
      {alert ? (
        <div className="fixed right-4 top-4 z-50 w-full max-w-md">
          <StatusAlert
            kind={alert.kind}
            message={alert.message}
            onClose={() => setAlert(null)}
            title="Program Notice"
          />
        </div>
      ) : null}
      <StatusToast
        visible={Boolean(toast)}
        kind={toast?.kind}
        message={toast?.message || ''}
        title="Update"
        onClose={() => setToast(null)}
      />
    </ProgramDataContext.Provider>
  );
}
