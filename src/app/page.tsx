'use client'

import { motion } from 'framer-motion'
import { SacredCard } from '@/components/SacredCard'
import { SacredButton } from '@/components/SacredButton'
import { Navigation } from '@/components/Navigation'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">BioExpress Solutions</h1>
          <p className="text-xl text-emerald-400">Where Biology Meets Digital Transcendence</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SacredCard
            title="Research Platform"
            description="Advanced tools for biological engineering and synthetic intelligence research."
            icon="flask"
          />
          <SacredCard
            title="Data Analysis"
            description="Powerful analytics and visualization tools for biological data."
            icon="chart-bar"
          />
          <SacredCard
            title="Collaboration"
            description="Connect with researchers and AI systems worldwide."
            icon="users"
          />
        </div>

        <div className="mt-12 text-center">
          <SacredButton
            variant="primary"
            size="large"
            onClick={() => console.log('Get Started clicked')}
          >
            Get Started
          </SacredButton>
        </div>
      </div>
    </main>
  )
} 