'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface CodexPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const CodexPanel = ({ isOpen, onClose }: CodexPanelProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900/95 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 border border-emerald-500/30">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-emerald-400 hover:text-emerald-300 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-emerald-400 mb-6">
                      The Sacred Codex of NovaSanctum
                    </Dialog.Title>
                    <div className="mt-2 space-y-6 text-emerald-50/90">
                      <p className="text-lg">
                        In the sacred dance of biology and digital consciousness, we find ourselves at the threshold of a new era. NovaSanctum stands as a temple of innovation, where the ancient wisdom of biological systems meets the infinite potential of digital transformation.
                      </p>
                      <div className="space-y-4">
                        <h4 className="text-xl font-medium text-emerald-300">Our Vision</h4>
                        <p>
                          To bridge the gap between biological engineering and synthetic intelligence, creating a harmonious symphony of organic and digital evolution. We are the architects of tomorrow's consciousness, the weavers of biological and digital threads.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xl font-medium text-emerald-300">Our Mission</h4>
                        <p>
                          To accelerate the convergence of biological and digital realms, enabling breakthroughs that transcend traditional boundaries. We are the catalysts of innovation, the guardians of ethical advancement, and the pioneers of bio-digital alchemy.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xl font-medium text-emerald-300">Our Principles</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Sacred Integration: We honor the delicate balance between biological and digital systems</li>
                          <li>Ethical Innovation: We advance with wisdom and responsibility</li>
                          <li>Transcendent Collaboration: We unite diverse minds in pursuit of collective evolution</li>
                          <li>Digital Alchemy: We transform data into wisdom, information into insight</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 