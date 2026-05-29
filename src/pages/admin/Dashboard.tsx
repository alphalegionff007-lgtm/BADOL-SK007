import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Member, Lead, GymPackage, Trainer, GymClass, Payment } from '../../types';
import { 
  Users, ClipboardCheck, TrendingUp, AlertTriangle, 
  Dumbbell, CalendarCheck, HelpCircle, FileText, ChevronRight 
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';

interface DashboardProps {
  setHash: (hash: string) => void;
}

export default function Dashboard({ setHash }: DashboardProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pkgs, setPkgs] = useState<GymPackage[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [mList, lList, pList, tList, cList, payList] = await Promise.all([
          dbService.getMembers(),
          dbService.getLeads(),
          dbService.getPackages(),
          dbService.getTrainers(),
          dbService.getClasses(),
          dbService.getPayments()
        ]);
        
        setMembers(mList);
        setLeads(lList);
        setPkgs(pList);
        setTrainers(tList);
        setClasses(cList);
        setPayments(payList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Aggregated calculations
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.member_status === 'active').length;
  const pendingLeads = leads.filter(l => l.status === 'new').length;
  
  // Monthly revenue logic (total payments this month)
  const monthlyRevenue = payments
    .filter(p => p.payment_status === 'paid')
    .reduce((curr, p) => curr + p.amount, 0);

  const pendingPaymentsCount = members.filter(m => m.payment_status === 'pending').length;
  const activePackagesCount = pkgs.filter(p => p.is_active).length;
  const upcomingClassesCount = classes.filter(c => c.is_active).length;
  const totalTrainersCount = trainers.length;

  if (loading) {
    return (
      <div className="text-zinc-500 text-center py-20 text-xs font-bold tracking-widest uppercase">
        Compiling dashboard telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white p-2">
      {/* 1. ROW STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Registered" 
          value={totalMembers} 
          icon={<Users className="w-5 h-5" />} 
          subtitle="Lifetime member admissions"
        />
        <StatCard 
          label="Active Lifters" 
          value={activeMembers} 
          icon={<Dumbbell className="w-5 h-5 animate-pulse text-amber-500" />} 
          subtitle="Currently active in classes"
          trend={{ value: `${totalMembers ? Math.round((activeMembers / totalMembers) * 100) : 0}% ratio`, isUp: true }}
        />
        <StatCard 
          label="Pending Leads" 
          value={pendingLeads} 
          icon={<ClipboardCheck className="w-5 h-5" />} 
          subtitle="New signups awaiting contact"
          trend={pendingLeads > 0 ? { value: 'Inbound Action Required', isUp: false } : undefined}
        />
        <StatCard 
          label="Total Revenue" 
          value={`৳${monthlyRevenue.toLocaleString('en-BD')}`} 
          icon={<TrendingUp className="w-5 h-5" />} 
          subtitle="Sourced on bKash/Nagad/Cash"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Pending Payments" 
          value={pendingPaymentsCount} 
          icon={<AlertTriangle className="w-5 h-5 text-rose-500" />} 
          subtitle="Unresolved dues files"
        />
        <StatCard 
          label="Active Packages" 
          value={activePackagesCount} 
          icon={<FileText className="w-5 h-5" />} 
          subtitle="Offerings visible on site"
        />
        <StatCard 
          label="Shift Classes" 
          value={upcomingClassesCount} 
          icon={<CalendarCheck className="w-5 h-5" />} 
          subtitle="Classes running weekly"
        />
        <StatCard 
          label="Total trainers" 
          value={totalTrainersCount} 
          icon={<Users className="w-5 h-5" />} 
          subtitle="Acclimated floor coaches"
        />
      </div>

      {/* 2. RECENT INBOUND ACTION TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads block */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-extrabold uppercase text-amber-500 tracking-wider">New Admission Leads</h3>
            <button 
              onClick={() => setHash('#admin/leads')}
              className="text-[11px] font-bold uppercase text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              Leads Board <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {leads.filter(l => l.status === 'new').length === 0 ? (
            <p className="text-zinc-550 text-xs py-8 text-center text-zinc-500 font-semibold uppercase tracking-wider">No new inbound leads</p>
          ) : (
            <div className="space-y-4">
              {leads.filter(l => l.status === 'new').slice(0, 4).map((lead) => (
                <div 
                  key={lead.id} 
                  className="flex items-center justify-between p-3.5 bg-zinc-950/40 rounded-2xl border border-zinc-850/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="text-left text-xs leading-normal">
                    <p className="font-extrabold text-white text-zinc-200 uppercase tracking-wide">{lead.full_name}</p>
                    <p className="text-zinc-500 text-[11px] font-mono mt-0.5">{lead.phone} • Goal: {lead.fitness_goal}</p>
                  </div>
                  <StatusBadge status="new" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payments block */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-extrabold uppercase text-amber-500 tracking-wider">Recent Fee Transactions</h3>
            <button 
              onClick={() => setHash('#admin/payments')}
              className="text-[11px] font-bold uppercase text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              ledger <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {payments.length === 0 ? (
            <p className="text-zinc-550 text-xs py-8 text-center text-zinc-500 font-semibold uppercase tracking-wider">No recent payments logged</p>
          ) : (
            <div className="space-y-4">
              {payments.slice(0, 4).map((pay) => {
                const payerName = members.find(m => m.id === pay.member_id)?.full_name || 'Generic Member';
                return (
                  <div 
                    key={pay.id} 
                    className="flex items-center justify-between p-3.5 bg-zinc-950/40 rounded-2xl border border-zinc-850/80 hover:border-zinc-700 transition-colors"
                  >
                    <div className="text-left text-xs leading-normal">
                      <p className="font-extrabold text-white uppercase tracking-wide">{payerName}</p>
                      <p className="text-zinc-500 text-[11px] font-mono mt-0.5">Method: {pay.payment_method} • Ref ID: {pay.transaction_id || 'Cash Direct'}</p>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-emerald-400 font-black font-sans block">৳{pay.amount.toLocaleString('en-BD')}</span>
                      <span className="text-zinc-600 text-[9px] font-semibold tracking-wider font-mono uppercase block mt-0.5">{pay.payment_date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
