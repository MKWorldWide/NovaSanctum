import { Fragment, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

interface SacredTooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  delay?: number;
}

const positions = {
  top: {
    container: 'bottom-full mb-2',
    arrow: 'bottom-0 translate-y-1/2 rotate-45',
  },
  right: {
    container: 'left-full ml-2',
    arrow: 'left-0 -translate-x-1/2 -rotate-45',
  },
  bottom: {
    container: 'top-full mt-2',
    arrow: 'top-0 -translate-y-1/2 rotate-45',
  },
  left: {
    container: 'right-full mr-2',
    arrow: 'right-0 translate-x-1/2 rotate-45',
  },
};

export const SacredTooltip = ({
  content,
  children,
  position = 'top',
  className = '',
  delay = 0,
}: SacredTooltipProps) => {
  return (
    <Popover className="relative inline-block">
      {({ open }) => (
        <>
          <Popover.Button as="div" className="inline-block">
            {children}
          </Popover.Button>

          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className={`
                absolute z-50
                ${positions[position].container}
                ${className}
              `}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay }}
                className="relative"
              >
                <div
                  className={`
                    absolute w-2 h-2
                    bg-slate-900
                    ${positions[position].arrow}
                  `}
                />
                <div
                  className="
                  px-3 py-2
                  text-sm text-slate-200
                  bg-slate-900
                  border border-emerald-500/20
                  rounded-lg
                  shadow-lg shadow-emerald-500/10
                "
                >
                  {content}
                </div>
              </motion.div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
