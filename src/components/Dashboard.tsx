'use client';

import { motion } from 'framer-motion';
import { ChartBarIcon, BeakerIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const metrics = [
  {
    name: 'Active Research Projects',
    value: '12',
    icon: BeakerIcon,
    change: '+2',
    changeType: 'positive',
  },
  {
    name: 'Team Members',
    value: '24',
    icon: UserGroupIcon,
    change: '+3',
    changeType: 'positive',
  },
  {
    name: 'Recent Breakthroughs',
    value: '5',
    icon: ChartBarIcon,
    change: '+1',
    changeType: 'positive',
  },
  {
    name: 'Avg. Research Time',
    value: '3.2',
    icon: ClockIcon,
    change: '-0.4',
    changeType: 'negative',
  },
];

export const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-emerald-500/30 p-6"
    >
      <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Research Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map(metric => (
          <motion.div
            key={metric.name}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-800/50 rounded-lg p-4 border border-emerald-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-200/70">{metric.name}</p>
                <p className="text-2xl font-semibold text-emerald-400 mt-1">{metric.value}</p>
              </div>
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <metric.icon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div className="mt-2">
              <span
                className={`text-sm ${
                  metric.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {metric.change}
              </span>
              <span className="text-sm text-emerald-200/50 ml-1">this month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-emerald-300 mb-4">Recent Breakthroughs</h3>
        <div className="space-y-4">
          {[
            {
              title: 'Neural Interface Optimization',
              description: 'Achieved 40% reduction in latency while maintaining signal integrity',
              date: '2 days ago',
            },
            {
              title: 'Protein Folding Prediction',
              description: 'New algorithm shows 95% accuracy in tertiary structure prediction',
              date: '5 days ago',
            },
          ].map(breakthrough => (
            <motion.div
              key={breakthrough.title}
              whileHover={{ scale: 1.01 }}
              className="bg-slate-800/30 rounded-lg p-4 border border-emerald-500/10"
            >
              <h4 className="text-emerald-300 font-medium">{breakthrough.title}</h4>
              <p className="text-emerald-200/70 text-sm mt-1">{breakthrough.description}</p>
              <p className="text-emerald-200/50 text-xs mt-2">{breakthrough.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
