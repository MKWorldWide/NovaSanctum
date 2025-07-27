import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';

interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface SacredTabsProps {
  tabs: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const variants = {
  primary: {
    selected: 'text-emerald-400 border-emerald-500',
    hover: 'hover:text-emerald-400 hover:border-emerald-500/50',
    content: 'border-emerald-500/20',
  },
  secondary: {
    selected: 'text-cyan-400 border-cyan-500',
    hover: 'hover:text-cyan-400 hover:border-cyan-500/50',
    content: 'border-cyan-500/20',
  },
};

export const SacredTabs = ({
  tabs,
  defaultIndex = 0,
  onChange,
  className = '',
  variant = 'primary',
}: SacredTabsProps) => {
  return (
    <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
      <div className={className}>
        <Tab.List className="flex space-x-1 border-b border-slate-700">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              disabled={tab.disabled}
              className={({ selected }) => `
                relative px-4 py-2
                text-sm font-medium
                border-b-2
                transition-colors
                focus:outline-none
                ${selected ? variants[variant].selected : 'text-slate-400 border-transparent'}
                ${!tab.disabled && variants[variant].hover}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {({ selected }) => (
                <>
                  <div className="flex items-center space-x-2">
                    {tab.icon && (
                      <span className={selected ? 'text-current' : 'text-slate-400'}>
                        {tab.icon}
                      </span>
                    )}
                    <span>{tab.label}</span>
                  </div>
                  {selected && (
                    <motion.div
                      layoutId="activeTab"
                      className={`
                        absolute bottom-0 left-0 right-0 h-0.5
                        ${variants[variant].selected.split(' ')[1]}
                      `}
                    />
                  )}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={index}
              className={`
                rounded-lg
                border
                ${variants[variant].content}
                p-4
                focus:outline-none
              `}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {tab.content}
              </motion.div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};
