import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => ReactNode)
  className?: string
  sortable?: boolean
  filterable?: boolean
  width?: string
}

interface SacredTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  className?: string
  emptyMessage?: string
  isLoading?: boolean
  loadingMessage?: string
}

export const SacredTable = <T extends object>({
  columns,
  data,
  onRowClick,
  className = '',
  emptyMessage = 'No data available',
  isLoading = false,
  loadingMessage = 'Loading...'
}: SacredTableProps<T>) => {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-emerald-500/20 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900/50">
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`
                    px-6 py-3 text-left text-xs font-medium
                    text-emerald-400 uppercase tracking-wider
                    ${column.width ? `w-${column.width}` : ''}
                  `}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/10">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-slate-400"
                >
                  {loadingMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => onRowClick?.(item)}
                  className={`
                    ${onRowClick ? 'cursor-pointer' : ''}
                    hover:bg-emerald-500/5
                    transition-colors
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.header}
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm
                        text-slate-300
                      `}
                    >
                      {typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : (item as any)[column.accessor as keyof T]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 