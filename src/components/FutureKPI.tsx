"use client";

import React, { useMemo } from 'react';

export default function FutureKPI({ label, value, unit, trend = [] as number[], accent = 'from-indigo-500 to-fuchsia-500' }: {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number[];
  accent?: string; // tailwind gradient classes
}) {
  const points = useMemo(() => {
    if (!trend || trend.length === 0) return '';
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const norm = (n: number) => (max === min ? 0.5 : (n - min) / (max - min));
    return trend
      .map((n, i) => {
        const x = (i / Math.max(trend.length - 1, 1)) * 100;
        const y = 100 - norm(n) * 100;
        return `${x},${y}`;
      })
      .join(' ');
  }, [trend]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow backdrop-blur-md`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-10`} />
      <div className="relative">
        <div className="text-sm text-white/70">{label}</div>
        <div className="mt-1 text-3xl font-bold text-white">
          {value}
          {unit && <span className="ml-1 text-base text-white/70">{unit}</span>}
        </div>
        {trend && trend.length > 1 && (
          <svg viewBox="0 0 100 30" className="mt-3 h-12 w-full">
            <polyline fill="none" stroke="url(#grad)" strokeWidth="2" points={points.replace(/,([\d.]+)/g, ',$1')} />
            <defs>
              <linearGradient id="grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    </div>
  );
}

