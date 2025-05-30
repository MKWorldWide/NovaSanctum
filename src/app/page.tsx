'use client'

import { motion } from 'framer-motion'
import { DNAHelix } from '@/components/DNAHelix'
import { SacredCard } from '@/components/SacredCard'
import { SacredButton } from '@/components/SacredButton'
import { Navigation } from '@/components/Navigation'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-emerald-400 mb-4">
            NovaSanctum
          </h1>
          <p className="text-xl text-slate-300">
            Where Biology Meets Digital Transcendence
          </p>
        </motion.div>

        <div className="flex justify-center mb-16">
          <DNAHelix />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <SacredCard
            title="Research"
            description="Explore the frontiers of synthetic biology"
            icon="🧬"
          />
          <SacredCard
            title="Data"
            description="Advanced analytics and visualization"
            icon="📊"
          />
          <SacredCard
            title="Collaborate"
            description="Connect with researchers worldwide"
            icon="🌐"
          />
        </div>

        <div className="text-center">
          <SacredButton
            variant="primary"
            size="large"
            onClick={() => console.log('Journey begins...')}
          >
            Begin Your Journey
          </SacredButton>
        </div>
      </div>
    </main>
  )
} 