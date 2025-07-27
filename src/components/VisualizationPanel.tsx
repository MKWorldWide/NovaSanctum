'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';

type DataPoint = {
  x: number;
  y: number;
};

type Series = {
  id: string;
  data: DataPoint[];
};

type MockData = {
  [key: string]: Series[];
};

const mockData: MockData = {
  neuralActivity: [
    {
      id: 'neural-activity',
      data: [
        { x: 0, y: 0.2 },
        { x: 1, y: 0.5 },
        { x: 2, y: 0.3 },
        { x: 3, y: 0.8 },
        { x: 4, y: 0.6 },
        { x: 5, y: 0.9 },
      ],
    },
  ],
};

const visualizationTypes = [
  { id: 'neural', name: 'Neural Activity' },
  { id: 'protein', name: 'Protein Levels' },
  { id: 'genome', name: 'Genome Map' },
  { id: 'cell', name: 'Cell Behavior' },
];

export const VisualizationPanel = () => {
  const [selectedMetric, setSelectedMetric] = useState<keyof MockData>('neuralActivity');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-emerald-500/30 p-6"
    >
      <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Bio-Visualization</h2>

      <div className="space-y-6">
        <div className="flex gap-2">
          {visualizationTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedMetric(type.id as keyof MockData)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedMetric === type.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/50 text-emerald-200/70 hover:bg-slate-800/70'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div className="bg-slate-800/30 rounded-lg p-4 border border-emerald-500/10 h-[300px]">
          <div className="h-[400px]">
            <ResponsiveLine
              data={mockData[selectedMetric]}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false,
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Activity',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: '#00FF9D',
                    },
                  },
                  legend: {
                    text: {
                      fill: '#00FF9D',
                    },
                  },
                },
                grid: {
                  line: {
                    stroke: '#00FF9D20',
                  },
                },
                crosshair: {
                  line: {
                    stroke: '#00FF9D',
                  },
                },
              }}
            />
          </div>
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
  );
};
