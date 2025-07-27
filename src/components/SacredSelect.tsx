import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SacredSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export const SacredSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  error,
}: SacredSelectProps) => {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={className}>
      {label && (
        <label
          className={`
            block text-sm font-medium mb-1
            ${error ? 'text-red-400' : 'text-emerald-400'}
          `}
        >
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={`
              relative w-full py-2 pl-3 pr-10
              text-left rounded-lg
              bg-slate-900/50
              border
              ${
                error
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-emerald-500/50 focus:ring-emerald-500/50'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-900/70'}
              focus:outline-none focus:ring-2
              transition-colors
            `}
          >
            <span
              className={`
              block truncate
              ${selectedOption ? 'text-slate-200' : 'text-slate-500'}
            `}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="w-5 h-5 text-slate-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="
                absolute z-10 w-full py-1 mt-1
                overflow-auto rounded-lg
                bg-slate-900/95 backdrop-blur-sm
                border border-emerald-500/20
                shadow-lg shadow-emerald-500/10
                max-h-60
                focus:outline-none
              "
            >
              {options.map(option => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ active }) => `
                    relative cursor-pointer select-none
                    py-2 pl-10 pr-4
                    ${active ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'}
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {({ selected, active }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center"
                    >
                      {selected && (
                        <span className="absolute left-3">
                          <CheckIcon className="w-5 h-5 text-emerald-400" />
                        </span>
                      )}
                      <span
                        className={`
                        block truncate
                        ${selected ? 'font-medium' : 'font-normal'}
                      `}
                      >
                        {option.label}
                      </span>
                    </motion.div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
