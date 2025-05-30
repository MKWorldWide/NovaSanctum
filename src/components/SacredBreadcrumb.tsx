import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

interface SacredBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const SacredBreadcrumb = ({
  items,
  className = ''
}: SacredBreadcrumbProps) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                ml-2 flex items-center
                ${index === items.length - 1 ? 'text-emerald-400' : 'text-gray-400'}
              `}
            >
              {item.icon && (
                <span className="mr-2 text-current">{item.icon}</span>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className="text-sm font-medium hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </motion.div>
          </li>
        ))}
      </ol>
    </nav>
  )
} 