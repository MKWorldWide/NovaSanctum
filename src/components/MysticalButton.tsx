'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MysticalButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
}

export const MysticalButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon
}: MysticalButtonProps) => {
  const baseStyles = `
    relative inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-cyan-500
      text-white
      hover:from-emerald-600 hover:to-cyan-600
      focus:ring-emerald-500
      shadow-lg shadow-emerald-500/20
    `,
    secondary: `
      bg-slate-800
      text-emerald-400
      border border-emerald-500/20
      hover:bg-slate-700 hover:border-emerald-500/40
      focus:ring-emerald-500
    `,
    ghost: `
      text-emerald-400
      hover:bg-emerald-500/10
      focus:ring-emerald-500
    `
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
} 