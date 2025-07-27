import { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SacredRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'primary' | 'secondary';
}

export const SacredRadio = forwardRef<HTMLInputElement, SacredRadioProps>(
  ({ label, error, variant = 'primary', className = '', ...props }, ref) => {
    const variants = {
      primary: 'border-emerald-500/20 checked:bg-emerald-500',
      secondary: 'border-cyan-500/20 checked:bg-cyan-500',
    };

    return (
      <div className="space-y-2">
        <label className="flex items-center space-x-3 cursor-pointer">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
            <input
              type="radio"
              ref={ref}
              className={`
                w-5 h-5 rounded-full
                border-2 border-transparent
                bg-slate-900/50 backdrop-blur-sm
                checked:border-transparent
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                transition-all duration-200
                appearance-none cursor-pointer
                ${variants[variant]}
                ${error ? 'border-red-500/50' : ''}
                ${className}
              `}
              {...props}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 transition-opacity duration-200" />
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

SacredRadio.displayName = 'SacredRadio';
