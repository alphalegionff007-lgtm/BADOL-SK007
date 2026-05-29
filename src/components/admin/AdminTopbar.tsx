import React from 'react';
import { Menu, ShieldAlert, BadgeInfo, Building } from 'lucide-react';
import { getAdminUser, isSupabaseConfigured } from '../../lib/supabase';

interface AdminTopbarProps {
  currentPath: string;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export default function AdminTopbar({ currentPath, setSidebarOpen, sidebarOpen }: AdminTopbarProps) {
  const admin = getAdminUser();
  const routeLabels: Record<string, string> = {
    'admin/dashboard': 'Dashboard Overview',
    'admin/members': 'Member Management Registry',
    'admin/leads': 'Admission Actions & Leads Board',
    'admin/packages': 'Membership Packages configuration',
    'admin/trainers': 'Gym Fitness Coaches',
    'admin/classes': 'Weekly Schedule Planner',
    'admin/payments': 'Fee Collection & Payments Tracker',
    'admin/gallery': 'Cloudinary Gallery Center',
    'admin/testimonials': 'Testimonials and Success Stories',
    'admin/settings': 'Global Portal Settings',
  };

  const cleanLabel = routeLabels[currentPath] || 'Admin Controller';

  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-900 px-6 flex items-center justify-between text-white sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Toggle button on smaller screens */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-sm md:text-base font-extrabold tracking-wider uppercase bg-clip-text text-zinc-100">
          {cleanLabel}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Supabase status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800/80 text-[10px] font-bold uppercase tracking-wider">
          <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-zinc-400">Database:</span>
          <span className={isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}>
            {isSupabaseConfigured ? 'Supabase Live' : 'Local Storage Mode'}
          </span>
        </div>

        {/* Admin profile indicator */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 overflow-hidden shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div className="hidden md:block leading-none text-left">
            <span className="text-xs font-bold text-white block">Gym Owner</span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block truncate max-w-[124px]">
              {admin?.email || 'admin@ironelite.com'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
