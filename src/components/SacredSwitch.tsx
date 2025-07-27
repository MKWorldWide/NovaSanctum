import { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SacredSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'primary' | 'secondary';
}

export const SacredSwitch = forwardRef<HTMLInputElement, SacredSwitchProps>(
  ({ label, error, variant = 'primary', className = '', ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald-500',
      secondary: 'bg-cyan-500',
    };

    return (
      <div className="space-y-2">
        <label className="flex items-center space-x-3 cursor-pointer">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
            <input type="checkbox" ref={ref} className="sr-only" {...props} />
            <div
              className={`
                w-11 h-6 rounded-full
                bg-slate-900/50 backdrop-blur-sm
                transition-colors duration-200
                ${props.checked ? variants[variant] : 'bg-slate-700'}
                ${error ? 'ring-2 ring-red-500/50' : ''}
                ${className}
              `}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-lg"
                animate={{
                  x: props.checked ? 20 : 2,
                  y: 2,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            </div>
          </motion.div>
          {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
        </label>
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

SacredSwitch.displayName = 'SacredSwitch';
