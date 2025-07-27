'use client';

import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const mockData = [
  {
    id: 'GENE-001',
    name: 'CRISPR-Cas9 Variant',
    type: 'Gene Editing',
    date: '2024-03-15',
    status: 'Active',
  },
  {
    id: 'BIO-002',
    name: 'Neural Stem Cell Culture',
    type: 'Cell Biology',
    date: '2024-03-14',
    status: 'Analysis',
  },
  {
    id: 'PROT-003',
    name: 'Synthetic Protein X',
    type: 'Protein Engineering',
    date: '2024-03-13',
    status: 'Completed',
  },
];

export const DataVault = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-emerald-500/30 p-6"
    >
      <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Data Vault</h2>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-emerald-400/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, name, or type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-emerald-500/20 rounded-lg py-2 pl-10 pr-4 text-emerald-50 placeholder-emerald-200/30 focus:outline-none focus:border-emerald-500/40"
            />
          </div>
          <button className="p-2 bg-slate-800/50 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-slate-800/70 transition-colors">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2">
          {['all', 'Gene Editing', 'Cell Biology', 'Protein Engineering'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedType === type
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/50 text-emerald-200/70 hover:bg-slate-800/70'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {mockData.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="bg-slate-800/30 rounded-lg p-4 border border-emerald-500/10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-emerald-300 font-medium">{item.name}</h4>
                  <p className="text-emerald-200/50 text-sm mt-1">{item.id}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : item.status === 'Analysis'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-emerald-200/70">
                <span>{item.type}</span>
                <span>{item.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
