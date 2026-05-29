import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GymPackage } from '../../types';
import PackageCard from '../../components/website/PackageCard';
import { Percent, ShieldAlert, BadgeInfo } from 'lucide-react';

interface PackagesProps {
  setHash: (hash: string) => void;
  setPreselectedPackage: (pkg: string) => void;
}

export default function Packages({ setHash, setPreselectedPackage }: PackagesProps) {
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPackages() {
      try {
        const data = await dbService.getPackages(true);
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const handleJoin = (pkgName: string) => {
    setPreselectedPackage(pkgName);
    setHash('#join');
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            Membership Bundles
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Choose Your Lifting Program
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            We provide transparent pricing with student-friendly options, ladies batch plans, and high-intensity personal training programs. Select a package and apply online.
          </p>
        </div>

        {/* Loading state indicator */}
        {loading ? (
          <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">
            Syncing price catalog...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 items-stretch max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} onJoin={handleJoin} />
            ))}
          </div>
        )}

        {/* Special Local BD Policy Notice */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-xl">
          {/* Col 1 */}
          <div className="flex gap-4 items-start col-span-2">
            <div className="p-3 bg-amber-500/10 border border-amber-500/15 rounded-2xl text-amber-500 shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white uppercase tracking-wide">Refund & Package Freeze Rules</h3>
              <p className="text-zinc-400 text-xs font-normal leading-relaxed">
                We accept major mobile wallets including **bKash, Nagad, and Rocket** for seamless admissions payments. Monthly plans cannot be frozen. The Yearly plan can be frozen up to 30 days due to injuries or semester exams with standard medical logs. Admission fees are currently 100% free!
              </p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-8 text-center md:text-left space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-amber-500 font-bold font-mono">
              <BadgeInfo className="w-3.5 h-3.5" /> STUDENT DISCOUNTS
            </div>
            <p className="text-zinc-500 text-xs leading-normal">
              University students receive a discounted rate of ৳1,800/month during offpeak slots (09:00 AM - 04:00 PM). Requires a valid university ID card.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
