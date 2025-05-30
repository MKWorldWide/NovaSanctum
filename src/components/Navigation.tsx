'use client'

import { motion } from 'framer-motion'
import { useSacredStore } from '@/store/SacredStore'

export const Navigation = () => {
  const { sidebarOpen, toggleSidebar } = useSacredStore()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-emerald-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-emerald-400"
          >
            BioExpress
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/research">Research</NavLink>
            <NavLink href="/data">Data</NavLink>
            <NavLink href="/collaborate">Collaborate</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="md:hidden text-emerald-400"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </nav>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-emerald-400/80 hover:text-emerald-400 transition-colors duration-200"
    >
      {children}
    </motion.a>
  )
} 