import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'expired' | 'pending' | 'blocked' | 'paid' | 'failed' | 'refunded' | 'new' | 'contacted' | 'converted' | 'rejected';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const configs: Record<string, { bg: string; text: string; dot: string }> = {
    // Member statuses
    active: { bg: 'bg-emerald-500/10 border-emerald-500/25', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    expired: { bg: 'bg-amber-500/10 border-amber-500/25', text: 'text-amber-400', dot: 'bg-amber-400' },
    pending: { bg: 'bg-blue-500/10 border-blue-500/25', text: 'text-blue-400', dot: 'bg-blue-400' },
    blocked: { bg: 'bg-rose-500/10 border-rose-500/25', text: 'text-rose-400', dot: 'bg-rose-500' },

    // Payment statuses
    paid: { bg: 'bg-emerald-500/10 border-emerald-500/25', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    failed: { bg: 'bg-rose-500/10 border-rose-500/25', text: 'text-rose-400', dot: 'bg-rose-500' },
    refunded: { bg: 'bg-slate-500/10 border-slate-500/25', text: 'text-slate-400', dot: 'bg-slate-500' },

    // Lead statuses
    new: { bg: 'bg-purple-500/10 border-purple-500/25', text: 'text-purple-400', dot: 'bg-purple-500' },
    contacted: { bg: 'bg-amber-500/10 border-amber-500/25', text: 'text-amber-400', dot: 'bg-amber-400' },
    converted: { bg: 'bg-emerald-500/10 border-emerald-500/25', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    rejected: { bg: 'bg-zinc-800/80 border-zinc-700/60', text: 'text-zinc-500', dot: 'bg-zinc-650' }
  };

  const current = configs[status] || { bg: 'bg-zinc-800 border-zinc-700', text: 'text-zinc-400', dot: 'bg-zinc-500' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest ${current.bg} ${current.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}
