import { Fragment, ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

interface SacredDropdownProps {
  label: string
  items: {
    label: string
    onClick: () => void
    icon?: ReactNode
    disabled?: boolean
  }[]
  className?: string
  align?: 'left' | 'right'
  trigger?: ReactNode
}

export const SacredDropdown = ({
  label,
  items,
  className = '',
  align = 'right',
  trigger
}: SacredDropdownProps) => {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      {({ open }: { open: boolean }) => (
        <>
          <Menu.Button
            className={`
              inline-flex items-center justify-center
              px-4 py-2 text-sm font-medium
              bg-emerald-500/10 hover:bg-emerald-500/20
              text-emerald-400
              border border-emerald-500/20
              rounded-lg
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50
            `}
          >
            {trigger || (
              <>
                {label}
                <ChevronDownIcon
                  className={`
                    ml-2 -mr-1 h-5 w-5
                    transition-transform duration-200
                    ${open ? 'transform rotate-180' : ''}
                  `}
                  aria-hidden="true"
                />
              </>
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={`
                absolute z-10 mt-2 w-56
                origin-top-right rounded-lg
                bg-slate-900/95 backdrop-blur-sm
                border border-emerald-500/20
                shadow-lg shadow-emerald-500/10
                focus:outline-none
                ${align === 'right' ? 'right-0' : 'left-0'}
              `}
            >
              <div className="py-1">
                {items.map((item, index) => (
                  <Menu.Item key={index}>
                    {({ active }: { active: boolean }) => (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className={`
                          ${active ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'}
                          ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          group flex w-full items-center
                          px-4 py-2 text-sm
                          transition-colors
                        `}
                      >
                        {item.icon && (
                          <span className="mr-3 h-5 w-5" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </motion.button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

interface SacredDropdownItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export const SacredDropdownItem = ({
  children,
  onClick,
  className = ''
}: SacredDropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-2 text-sm text-left text-gray-300
        hover:bg-emerald-500/10 hover:text-white
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </button>
  )
}

interface SacredDropdownDividerProps {
  className?: string
}

export const SacredDropdownDivider = ({
  className = ''
}: SacredDropdownDividerProps) => {
  return (
    <div
      className={`
        h-px my-1 bg-emerald-500/20
        ${className}
      `}
    />
  )
} 