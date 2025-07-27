import { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SacredInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'primary' | 'secondary';
}

export const SacredInput = forwardRef<HTMLInputElement, SacredInputProps>(
  ({ label, error, variant = 'primary', className = '', ...props }, ref) => {
    const variants = {
      primary: 'bg-slate-900 border-emerald-500/20 focus:border-emerald-500',
      secondary: 'bg-slate-800 border-cyan-500/20 focus:border-cyan-500',
    };

    return (
      <div className="space-y-2">
        {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <input
            ref={ref}
            className={`
              w-full px-4 py-2 rounded-lg
              border border-transparent
              bg-slate-900/50 backdrop-blur-sm
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-emerald-500/20
              transition-all duration-200
              ${variants[variant]}
              ${error ? 'border-red-500/50' : ''}
              ${className}
            `}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

SacredInput.displayName = 'SacredInput';
