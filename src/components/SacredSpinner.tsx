import { motion } from 'framer-motion'

interface SacredSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  className?: string
  label?: string
}

const sizes = {
  sm: {
    width: 'w-4',
    height: 'h-4',
    border: 'border-2',
    text: 'text-xs'
  },
  md: {
    width: 'w-6',
    height: 'h-6',
    border: 'border-2',
    text: 'text-sm'
  },
  lg: {
    width: 'w-8',
    height: 'h-8',
    border: 'border-3',
    text: 'text-base'
  }
}

const variants = {
  primary: 'border-emerald-500 border-t-transparent',
  success: 'border-green-500 border-t-transparent',
  warning: 'border-yellow-500 border-t-transparent',
  error: 'border-red-500 border-t-transparent',
  info: 'border-cyan-500 border-t-transparent'
}

export const SacredSpinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  label
}: SacredSpinnerProps) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        className={`
          ${sizes[size].width}
          ${sizes[size].height}
          ${sizes[size].border}
          ${variants[variant]}
          rounded-full
        `}
      />
      {label && (
        <span className={`ml-2 text-slate-300 ${sizes[size].text}`}>
          {label}
        </span>
      )}
    </div>
  )
} 