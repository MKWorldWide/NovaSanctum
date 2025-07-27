import { useState, useCallback } from 'react';
import { useSacredData } from '@/providers/SacredDataProvider';

interface UseSacredAPIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useSacredAPI = (options: UseSacredAPIOptions = {}) => {
  const { showAlert, showToast, setIsLoading, setError } = useSacredData();
  const [data, setData] = useState<any>(null);

  const execute = useCallback(
    async (promise: Promise<any>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await promise;
        setData(result);

        if (options.successMessage) {
          showToast('success', options.successMessage);
        }

        options.onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(errorMessage);

        if (options.errorMessage) {
          showAlert('error', options.errorMessage);
        }

        options.onError?.(error as Error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError, showToast, showAlert, options]
  );

  return {
    data,
    execute,
    reset: () => setData(null),
  };
};
