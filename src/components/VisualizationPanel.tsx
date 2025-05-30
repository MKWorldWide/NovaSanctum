'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@nivo/line'

const mockData = {
  neuralActivity: [
    { x: 0, y: 0.2 },
    { x: 1, y: 0.4 },
    { x: 2, y: 0.3 },
    { x: 3, y: 0.6 },
    { x: 4, y: 0.5 },
    { x: 5, y: 0.8 },
  ],
  proteinLevels: [
    { x: 0, y: 0.3 },
    { x: 1, y: 0.5 },
    { x: 2, y: 0.4 },
    { x: 3, y: 0.7 },
    { x: 4, y: 0.6 },
    { x: 5, y: 0.9 },
  ],
}

const visualizationTypes = [
  { id: 'neural', name: 'Neural Activity' },
  { id: 'protein', name: 'Protein Levels' },
  { id: 'genome', name: 'Genome Map' },
  { id: 'cell', name: 'Cell Behavior' },
]

export const VisualizationPanel = () => {
  const [selectedType, setSelectedType] = useState('neural')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-emerald-500/30 p-6"
    >
      <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Bio-Visualization</h2>

      <div className="space-y-6">
        <div className="flex gap-2">
          {visualizationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedType === type.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/50 text-emerald-200/70 hover:bg-slate-800/70'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald-500/10 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                {
                  id: 'Neural Activity',
                  data: mockData.neuralActivity,
                },
                {
                  id: 'Protein Levels',
                  data: mockData.proteinLevels,
                },
              ]}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis
                dataKey="x"
                stroke="#00ff9d"
                tick={{ fill: '#00ff9d' }}
                label={{ value: 'Time (s)', position: 'bottom', fill: '#00ff9d' }}
              />
              <YAxis
                stroke="#00ff9d"
                tick={{ fill: '#00ff9d' }}
                label={{ value: 'Activity', angle: -90, position: 'left', fill: '#00ff9d' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #00ff9d',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: '#00ff9d' }}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#00ff9d"
                strokeWidth={2}
                dot={{ fill: '#00ff9d' }}
                activeDot={{ r: 8, fill: '#00ff9d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald-500/10">
            <h3 className="text-emerald-300 font-medium mb-2">Current Status</h3>
            <p className="text-emerald-200/70 text-sm">
              Neural activity showing stable patterns with 95% confidence interval
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald-500/10">
            <h3 className="text-emerald-300 font-medium mb-2">Analysis</h3>
            <p className="text-emerald-200/70 text-sm">
              Protein levels correlating with neural activity (r = 0.87)
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 