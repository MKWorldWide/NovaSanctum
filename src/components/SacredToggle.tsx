import { motion } from 'framer-motion'

interface SacredToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: {
    width: 'w-8',
    height: 'h-4',
    dot: 'w-3 h-3',
    translate: 'translate-x-4'
  },
  md: {
    width: 'w-12',
    height: 'h-6',
    dot: 'w-5 h-5',
    translate: 'translate-x-6'
  },
  lg: {
    width: 'w-16',
    height: 'h-8',
    dot: 'w-7 h-7',
    translate: 'translate-x-8'
  }
}

export const SacredToggle = ({
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
  size = 'md'
}: SacredToggleProps) => {
  return (
    <label
      className={`
        inline-flex items-center
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <motion.div
          className={`
            ${sizes[size].width}
            ${sizes[size].height}
            rounded-full
            ${checked ? 'bg-emerald-500' : 'bg-slate-700'}
            transition-colors
          `}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`
              absolute top-1/2 -translate-y-1/2 left-1
              ${sizes[size].dot}
              rounded-full
              bg-white
              shadow-lg
              transition-transform
              ${checked ? sizes[size].translate : ''}
            `}
            animate={{
              x: checked ? sizes[size].translate.replace('translate-x-', '') : 0
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </div>
      {label && (
        <span
          className={`
            ml-3 text-sm
            ${disabled ? 'text-slate-500' : 'text-slate-300'}
          `}
        >
          {label}
        </span>
      )}
    </label>
  )
} 