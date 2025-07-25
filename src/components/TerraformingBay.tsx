import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  GlobeAltIcon,
  SparklesIcon,
  SunIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';

interface SeedCanister {
  id: string;
  name: string;
  type: 'flora' | 'fauna' | 'microbial';
  status: 'ready' | 'deploying' | 'deployed';
  progress: number;
}

interface EnvironmentalMetrics {
  temperature: number;
  humidity: number;
  oxygen: number;
  nitrogen: number;
  co2: number;
}

const initialCanisters: SeedCanister[] = [
  {
    id: 'flora-1',
    name: 'Ancient Redwood',
    type: 'flora',
    status: 'ready',
    progress: 0,
  },
  {
    id: 'fauna-1',
    name: 'Quantum Butterfly',
    type: 'fauna',
    status: 'ready',
    progress: 0,
  },
  {
    id: 'microbial-1',
    name: 'Atmospheric Algae',
    type: 'microbial',
    status: 'ready',
    progress: 0,
  },
];

const initialMetrics: EnvironmentalMetrics = {
  temperature: 22,
  humidity: 45,
  oxygen: 21,
  nitrogen: 78,
  co2: 0.04,
};

export function TerraformingBay() {
  const [canisters, setCanisters] = useState<SeedCanister[]>(initialCanisters);
  const [selectedCanister, setSelectedCanister] = useState<string | null>(null);

  const deployCanister = (id: string) => {
    setCanisters(prev =>
      prev.map(canister =>
        canister.id === id ? { ...canister, status: 'deploying', progress: 0 } : canister
      )
    );

    // Simulate deployment progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setCanisters(prev =>
        prev.map(canister =>
          canister.id === id
            ? {
                ...canister,
                progress,
                status: progress >= 100 ? 'deployed' : 'deploying',
              }
            : canister
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CRISPR TerraSeed Bay</h1>
          <p className="text-xl text-emerald-200">Planetary Seeding and Environmental Control</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Environmental Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6">Environmental Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SunIcon className="w-6 h-6 text-yellow-400" />
                  <span>Temperature</span>
                </div>
                <span className="text-2xl font-mono">{initialMetrics.temperature}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CloudIcon className="w-6 h-6 text-blue-400" />
                  <span>Humidity</span>
                </div>
                <span className="text-2xl font-mono">{initialMetrics.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="w-6 h-6 text-purple-400" />
                  <span>Oxygen</span>
                </div>
                <span className="text-2xl font-mono">{initialMetrics.oxygen}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="w-6 h-6 text-green-400" />
                  <span>Nitrogen</span>
                </div>
                <span className="text-2xl font-mono">{initialMetrics.nitrogen}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-6 h-6 text-red-400" />
                  <span>CO₂</span>
                </div>
                <span className="text-2xl font-mono">{initialMetrics.co2}%</span>
              </div>
            </div>
          </motion.div>

          {/* Seed Canisters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6">Seed Canisters</h2>
            <div className="space-y-4">
              {canisters.map(canister => (
                <motion.div
                  key={canister.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg cursor-pointer flex items-center justify-between space-x-4 transition-all duration-200 ${
                    selectedCanister === canister.id
                      ? 'ring-2 ring-emerald-400 bg-white/20 border-2 border-emerald-400'
                      : 'bg-white/10 border border-white/20'
                  }`}
                  onClick={() => setSelectedCanister(canister.id)}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{canister.name}</h3>
                    <p className="text-sm text-emerald-200">Type: {canister.type}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        canister.status === 'ready'
                          ? 'bg-green-100 text-green-800'
                          : canister.status === 'deploying'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {canister.status.charAt(0).toUpperCase() + canister.status.slice(1)}
                  </span>
                  {canister.status === 'deploying' && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${canister.progress}%` }}
                      ></div>
                    </div>
                  )}
                  {canister.status === 'ready' && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deployCanister(canister.id);
                      }}
                      className="mt-2 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                      Deploy
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
