import { motion } from 'framer-motion'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface SacredTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  className?: string
  emptyMessage?: string
  loading?: boolean
}

export function SacredTable<T>({
  columns,
  data,
  onRowClick,
  className = '',
  emptyMessage = 'No data available',
  loading = false
}: SacredTableProps<T>) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-emerald-500/20 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-3 text-left text-xs font-medium
                    text-emerald-400 uppercase tracking-wider
                    ${column.width ? `w-${column.width}` : ''}
                    ${column.align ? `text-${column.align}` : ''}
                  `}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/10">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-slate-400"
                >
                  Loading...
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
                      key={column.key}
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm
                        text-slate-300
                        ${column.align ? `text-${column.align}` : ''}
                      `}
                    >
                      {column.render
                        ? column.render(item)
                        : (item as any)[column.key]}
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