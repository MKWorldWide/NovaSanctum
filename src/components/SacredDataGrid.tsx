import { ReactNode, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SacredTable, Column } from './SacredTable'
import { SacredPagination } from './SacredPagination'
import { SacredDropdown } from './SacredDropdown'
import { SacredAlert } from './SacredAlert'
import { SacredSpinner } from './SacredSpinner'

interface Filter {
  column: string
  value: string
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith'
}

interface SacredDataGridProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  onRowClick?: (item: T) => void
  onSelectionChange?: (selectedItems: T[]) => void
  className?: string
  emptyMessage?: string
  isLoading?: boolean
  loadingMessage?: string
  error?: string
  onErrorDismiss?: () => void
  showPagination?: boolean
  showFilters?: boolean
  showColumnSelector?: boolean
  showExport?: boolean
  onExport?: (data: T[]) => void
}

export const SacredDataGrid = <T extends object>({
  columns,
  data,
  pageSize = 10,
  onRowClick,
  onSelectionChange,
  className = '',
  emptyMessage = 'No data available',
  isLoading = false,
  loadingMessage = 'Loading sacred data...',
  error,
  onErrorDismiss,
  showPagination = true,
  showFilters = true,
  showColumnSelector = true,
  showExport = true,
  onExport
}: SacredDataGridProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filter[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map(col => typeof col.accessor === 'string' ? col.accessor : col.header)
  )
  const [selectedItems, setSelectedItems] = useState<T[]>([])

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return filters.every(filter => {
        const value = String(item[filter.column as keyof T]).toLowerCase()
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case 'contains':
            return value.includes(filterValue)
          case 'equals':
            return value === filterValue
          case 'startsWith':
            return value.startsWith(filterValue)
          case 'endsWith':
            return value.endsWith(filterValue)
          default:
            return true
        }
      })
    })
  }, [data, filters])

  const visibleColumns = useMemo(() => {
    return columns.filter(col => {
      const colKey = typeof col.accessor === 'string' ? col.accessor : col.header
      return selectedColumns.includes(colKey)
    })
  }, [columns, selectedColumns])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const handleFilterChange = useCallback((column: string, value: string, operator: Filter['operator']) => {
    setFilters(current => {
      const existing = current.find(f => f.column === column)
      if (existing) {
        return current.map(f => 
          f.column === column ? { ...f, value, operator } : f
        )
      }
      return [...current, { column, value, operator }]
    })
    setCurrentPage(1)
  }, [])

  const handleColumnToggle = useCallback((column: string) => {
    setSelectedColumns(current => 
      current.includes(column)
        ? current.filter(c => c !== column)
        : [...current, column]
    )
  }, [])

  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelection = checked ? paginatedData : []
    setSelectedItems(newSelection)
    onSelectionChange?.(newSelection)
  }, [paginatedData, onSelectionChange])

  const handleSelectItem = useCallback((item: T, checked: boolean) => {
    const newSelection = checked
      ? [...selectedItems, item]
      : selectedItems.filter(i => i !== item)
    setSelectedItems(newSelection)
    onSelectionChange?.(newSelection)
  }, [selectedItems, onSelectionChange])

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <SacredAlert
          type="error"
          title="Error"
          message={error}
          onClose={onErrorDismiss}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showFilters && (
            <SacredDropdown
              label="Filters"
              items={columns
                .filter(col => col.filterable)
                .map(column => ({
                  label: column.header,
                  onClick: () => handleFilterChange(
                    typeof column.accessor === 'string' ? column.accessor : column.header,
                    '',
                    'contains'
                  )
                }))}
              trigger={
                <button className="px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  Filters ({filters.length})
                </button>
              }
            />
          )}

          {showColumnSelector && (
            <SacredDropdown
              label="Columns"
              items={columns.map(column => {
                const colKey = typeof column.accessor === 'string' ? column.accessor : column.header;
                return {
                  label: column.header,
                  onClick: () => handleColumnToggle(colKey)
                };
              })}
              trigger={
                <button className="px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  Columns
                </button>
              }
            />
          )}
        </div>

        {showExport && onExport && (
          <button
            onClick={() => onExport(filteredData)}
            className="px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Export
          </button>
        )}
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
            <SacredSpinner size="lg" />
          </div>
        )}

        <SacredTable
          columns={visibleColumns}
          data={paginatedData}
          onRowClick={onRowClick}
          emptyMessage={emptyMessage}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-emerald-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} items
          </div>
          <SacredPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
} 