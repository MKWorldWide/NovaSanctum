import { forwardRef, TextareaHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface SacredTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const SacredTextarea = forwardRef<HTMLTextAreaElement, SacredTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label
            className={`
              block text-sm font-medium
              ${error ? 'text-red-400' : 'text-emerald-400'}
              mb-1
            `}
          >
            {label}
          </label>
        )}
        <motion.div whileFocus={{ scale: 1.01 }}>
          <textarea
            ref={ref}
            className={`
              w-full px-4 py-2
              bg-slate-900/50
              border rounded-lg
              text-slate-200
              placeholder-slate-500
              focus:outline-none focus:ring-2
              transition-colors
              resize-none
              ${
                error
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-emerald-500/50 focus:ring-emerald-500/50'
              }
              ${className}
            `}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

SacredTextarea.displayName = 'SacredTextarea';
