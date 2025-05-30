import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface SacredAccordionProps {
  items: AccordionItem[]
  defaultOpen?: string[]
  className?: string
}

export const SacredAccordion = ({
  items,
  defaultOpen = [],
  className = ''
}: SacredAccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-emerald-500/20 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-emerald-500/5 transition-colors"
          >
            <span className="text-sm font-medium text-white">{item.title}</span>
            <motion.svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                rotate: openItems.includes(item.id) ? 180 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </button>
          <AnimatePresence>
            {openItems.includes(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 text-sm text-gray-300 border-t border-emerald-500/20">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
} 