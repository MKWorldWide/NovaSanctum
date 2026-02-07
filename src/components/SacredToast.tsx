import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SacredToastProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message: ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  className?: string;
}

export const SacredToast = ({
  isVisible,
  onClose,
  title,
  message,
  type = 'info',
  duration: _duration = 3000,
  className = '',
}: SacredToastProps) => {
  const types = {
    success: {
      icon: (
        <svg
          className="w-5 h-5 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
    },
    error: {
      icon: (
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
    },
    warning: {
      icon: (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
    },
    info: {
      icon: (
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`
            fixed bottom-4 right-4 z-50
            ${className}
          `}
        >
          <div
            className={`
              flex items-start p-4 rounded-lg
              border backdrop-blur-sm
              ${types[type].bg}
              ${types[type].border}
            `}
          >
            <div className="flex-shrink-0">{types[type].icon}</div>
            <div className="ml-3 w-0 flex-1">
              {title && <p className="text-sm font-medium text-white">{title}</p>}
              <p className="mt-1 text-sm text-gray-300">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={onClose}
                className="inline-flex text-gray-400 hover:text-white focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
