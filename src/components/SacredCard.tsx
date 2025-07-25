'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SacredCardProps {
  title?: string
  description?: string
  icon?: string
  children?: ReactNode
  className?: string
}

export const SacredCard = ({ title, description, icon, children, className = '' }: SacredCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6 ${className}`}
    >
      {icon && (
        <div className="text-emerald-400 mb-4">
          <i className={`fas fa-${icon} text-2xl`} />
        </div>
      )}
      {title && <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>}
      {description && <p className="text-emerald-400/80">{description}</p>}
      {children}
    </motion.div>
  )
} 