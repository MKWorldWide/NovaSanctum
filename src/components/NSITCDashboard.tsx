import React from 'react';
import { motion } from 'framer-motion';
import { TerraformingBay } from './TerraformingBay';
import {
  BeakerIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

/**
 * NS-ITC Dashboard Component
 *
 * This component serves as the main control interface for the NovaSanctum Interplanetary Transport Cabin.
 * It integrates various subsystems including the Terraforming Bay, Life Support, Navigation, and Defense.
 *
 * @component
 */
const NSITCDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = React.useState<string>('terraforming');

  const modules = [
    {
      id: 'terraforming',
      name: 'Terraforming Bay',
      icon: BeakerIcon,
      description: 'CRISPR seed management and environmental control',
    },
    {
      id: 'navigation',
      name: 'Navigation',
      icon: RocketLaunchIcon,
      description: 'Interplanetary trajectory and course correction',
    },
    {
      id: 'defense',
      name: 'Defense Systems',
      icon: ShieldCheckIcon,
      description: 'Shield management and threat detection',
    },
    {
      id: 'ai',
      name: 'AI Core',
      icon: CpuChipIcon,
      description: 'Quantum computing and decision support',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">NS-ITC Dashboard</h1>
          <p className="text-gray-300">
            NovaSanctum Interplanetary Transport Cabin Control Interface
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {modules.map(module => (
            <motion.button
              key={module.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModule(module.id)}
              className={`p-6 rounded-xl backdrop-blur-lg ${
                activeModule === module.id
                  ? 'bg-white/20 border-2 border-purple-500'
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              <module.icon className="w-8 h-8 mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
              <p className="text-sm text-gray-300">{module.description}</p>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={activeModule}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          {activeModule === 'terraforming' && <TerraformingBay />}
          {activeModule === 'navigation' && (
            <div className="text-center py-12">
              <RocketLaunchIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-2">Navigation Systems</h2>
              <p className="text-gray-300">Coming soon...</p>
            </div>
          )}
          {activeModule === 'defense' && (
            <div className="text-center py-12">
              <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-2">Defense Systems</h2>
              <p className="text-gray-300">Coming soon...</p>
            </div>
          )}
          {activeModule === 'ai' && (
            <div className="text-center py-12">
              <CpuChipIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-2">AI Core</h2>
              <p className="text-gray-300">Coming soon...</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NSITCDashboard;
