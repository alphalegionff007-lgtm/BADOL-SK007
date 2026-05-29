import React from 'react';
import { Check, Star } from 'lucide-react';
import { GymPackage } from '../../types';

interface PackageCardProps {
  key?: any;
  pkg: GymPackage;
  onJoin: (pkgName: string) => void;
}

export default function PackageCard({ pkg, onJoin }: PackageCardProps) {
  return (
    <div
      className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col h-full bg-zinc-900 border ${
        pkg.is_popular
          ? 'border-amber-500 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/30 md:scale-105 z-10'
          : 'border-zinc-800 hover:border-zinc-700 hover:translate-y-[-4px]'
      }`}
    >
      {/* Popular badge */}
      {pkg.is_popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-950 font-bold px-4 py-1 text-[11px] rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
          <Star className="w-3.5 h-3.5 fill-zinc-950" /> Most Popular
        </span>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
      <p className="text-xs text-zinc-400 min-h-[32px] mb-5 leading-normal">{pkg.description}</p>

      {/* Pricing */}
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-amber-500 font-sans">৳{pkg.price.toLocaleString('en-BD')}</span>
        <span className="text-zinc-400 text-xs font-semibold uppercase">
          / {pkg.duration_days === 30 ? 'Month' : pkg.duration_days === 90 ? '3 Mos' : pkg.duration_days === 180 ? '6 Mos' : pkg.duration_days === 365 ? 'Year' : `${pkg.duration_days} Days`}
        </span>
      </div>

      {/* Features Checklist */}
      <div className="flex-grow space-y-3 mb-8">
        {(Array.isArray(pkg.features) ? pkg.features : []).map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-zinc-300 text-xs leading-normal">{feature}</span>
          </div>
        ))}
      </div>

      {/* Join Button */}
      <button
        onClick={() => onJoin(pkg.name)}
        className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer ${
          pkg.is_popular
            ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 active:scale-[0.98]'
            : 'bg-zinc-800 hover:bg-zinc-700/80 text-white border border-zinc-700 hover:border-zinc-600 active:scale-[0.98]'
        }`}
      >
        Choose Package
      </button>
    </div>
  );
}
