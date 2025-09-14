"use client";

import React, { useEffect, useMemo, useState } from 'react';
import FutureKPI from '@/components/FutureKPI';
import { novaSanctumMasterController } from '@/services/NovaSanctumMasterController';

export default function NeoDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    try {
      setMetrics(novaSanctumMasterController.getUnifiedMetrics());
      setHealth(novaSanctumMasterController.getSystemHealth());
    } catch (e) {
      // ignore
    }
  }, []);

  const kpis = useMemo(() => {
    if (!metrics) return [] as any[];
    return [
      { label: 'Total Networks', value: metrics.totalNetworks, unit: '', trend: [8, 10, 12, 11, 14, 15] },
      { label: 'Active Collaborations', value: metrics.activeCollaborations, unit: '', trend: [3, 4, 5, 6, 6, 7] },
      { label: 'Publications (est)', value: metrics.publications, unit: '', trend: [200, 250, 260, 280, 300, 320] },
      { label: 'Patents (est)', value: metrics.patents, unit: '', trend: [80, 90, 95, 100, 110, 120] },
    ];
  }, [metrics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-fuchsia-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">NovaSanctum — Neo Dashboard</h1>
          <p className="mt-2 text-white/70">Futuristic overview of unified research and live system health.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <FutureKPI key={i} label={k.label} value={k.value} unit={k.unit} trend={k.trend} />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-white">By Type</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-white/90">
              {metrics &&
                Object.entries(metrics.byType || {}).map(([t, n]) => (
                  <div key={t} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
                    <span className="capitalize">{String(t).replace(/_/g, ' ')}</span>
                    <span className="font-semibold">{String(n)}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-white">System Health</h2>
            <div className="mt-4 space-y-2 text-white/90">
              {health &&
                Object.entries(health).slice(0, 8).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
                    <span className="capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="font-semibold">{(v as any)?.status || 'n/a'}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">Explore Research</h2>
          <p className="mt-2 text-white/70">Search global institutions, publications, and patents.</p>
          <a href="/search" className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Open Search</a>
        </div>
      </div>
    </div>
  );
}

