import { motion } from 'framer-motion';

interface SacredProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  showValue?: boolean;
  className?: string;
  label?: string;
}

const sizes = {
  sm: {
    height: 'h-1',
    text: 'text-xs',
  },
  md: {
    height: 'h-2',
    text: 'text-sm',
  },
  lg: {
    height: 'h-3',
    text: 'text-base',
  },
};

const variants = {
  primary: {
    bg: 'bg-emerald-500/20',
    fill: 'bg-emerald-500',
  },
  success: {
    bg: 'bg-green-500/20',
    fill: 'bg-green-500',
  },
  warning: {
    bg: 'bg-yellow-500/20',
    fill: 'bg-yellow-500',
  },
  error: {
    bg: 'bg-red-500/20',
    fill: 'bg-red-500',
  },
  info: {
    bg: 'bg-cyan-500/20',
    fill: 'bg-cyan-500',
  },
};

export const SacredProgress = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  className = '',
  label,
}: SacredProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className={`text-slate-300 ${sizes[size].text}`}>{label}</span>}
          {showValue && (
            <span className={`text-emerald-400 ${sizes[size].text}`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`
          relative w-full
          ${sizes[size].height}
          rounded-full
          ${variants[variant].bg}
          overflow-hidden
        `}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`
            absolute top-0 left-0 h-full
            ${variants[variant].fill}
            rounded-full
          `}
        />
      </div>
    </div>
  );
};
