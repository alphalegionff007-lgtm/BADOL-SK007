import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export default function StatCard({ label, value, icon, subtitle, trend }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase font-extrabold tracking-widest">{label}</p>
          <h3 className="text-2xl md:text-3xl font-black text-white mt-1.5 font-sans tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-805 text-amber-500">
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-4 border-t border-zinc-950 flex items-center justify-between text-[11px] font-semibold text-zinc-400">
          <span>{subtitle}</span>
          {trend && (
            <span className={trend.isUp ? 'text-emerald-400' : 'text-rose-400'}>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
