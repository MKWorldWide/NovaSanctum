import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

interface SacredPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showFirstLast?: boolean
}

export const SacredPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showFirstLast = true
}: SacredPaginationProps) => {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    const halfVisible = Math.floor(maxVisible / 2)

    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {showFirstLast && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg
            ${currentPage === 1
              ? 'text-slate-500 cursor-not-allowed'
              : 'text-emerald-400 hover:bg-emerald-500/10'
            }
            transition-colors
          `}
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <ChevronLeftIcon className="w-5 h-5 -ml-4" />
        </motion.button>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-2 rounded-lg
          ${currentPage === 1
            ? 'text-slate-500 cursor-not-allowed'
            : 'text-emerald-400 hover:bg-emerald-500/10'
          }
          transition-colors
        `}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </motion.button>

      {pageNumbers.map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`
            w-8 h-8 rounded-lg
            ${currentPage === page
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-slate-300 hover:bg-emerald-500/10'
            }
            transition-colors
          `}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-2 rounded-lg
          ${currentPage === totalPages
            ? 'text-slate-500 cursor-not-allowed'
            : 'text-emerald-400 hover:bg-emerald-500/10'
          }
          transition-colors
        `}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </motion.button>

      {showFirstLast && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg
            ${currentPage === totalPages
              ? 'text-slate-500 cursor-not-allowed'
              : 'text-emerald-400 hover:bg-emerald-500/10'
            }
            transition-colors
          `}
        >
          <ChevronRightIcon className="w-5 h-5" />
          <ChevronRightIcon className="w-5 h-5 -ml-4" />
        </motion.button>
      )}
    </div>
  )
} 