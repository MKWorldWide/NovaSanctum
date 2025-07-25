import { InputHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface SacredCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'primary' | 'secondary'
}

export const SacredCheckbox = forwardRef<HTMLInputElement, SacredCheckboxProps>(
  ({ label, error, variant = 'primary', className = '', ...props }, ref) => {
    const variants = {
      primary: 'border-emerald-500/20 checked:bg-emerald-500',
      secondary: 'border-cyan-500/20 checked:bg-cyan-500'
    }

    return (
      <div className="space-y-2">
        <label className="flex items-center space-x-3 cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <input
              type="checkbox"
              ref={ref}
              className={`
                w-5 h-5 rounded
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
              <svg
                className="w-3 h-3 text-white opacity-0 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>
          {label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
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
    )
  }
)

SacredCheckbox.displayName = 'SacredCheckbox' 