import React from 'react';
import JoinForm from '../../components/website/JoinForm';
import { CheckSquare, HeartPulse, UserCheck } from 'lucide-react';

interface JoinProps {
  preselectedPackageName?: string;
  onSuccess: (toastMsg: string) => void;
  setHash: (hash: string) => void;
}

export default function Join({ preselectedPackageName = '', onSuccess, setHash }: JoinProps) {
  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            Apply Online
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Gym Admission Form
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            Secure your admission slot immediately. Pre-registered online entries bypass long administrative files. Our team will contact you to assign your trainer shift.
          </p>
        </div>

        {/* Join application form */}
        <JoinForm 
          preselectedPackageName={preselectedPackageName} 
          onSuccess={onSuccess} 
          setHash={setHash} 
        />

        {/* Supporting metrics list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 text-left">
          <div className="flex gap-3.5">
            <CheckSquare className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-zinc-300 font-bold text-xs uppercase tracking-wide">No Hidden registration Fee</h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Applying online is 100% free of charge. You only pay for your selected monthly or quarterly plan upon visiting.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <HeartPulse className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-zinc-300 font-bold text-xs uppercase tracking-wide">Trainer Matching Process</h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Based on your health check goals, we match you with specialists in powerlifting, fat burn, or prenatal ladies routines.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <UserCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-zinc-300 font-bold text-xs uppercase tracking-wide">Easy Batch Shifts toggles</h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Need to shift from morning student slots to evening slots? Notify the front counter and toggle your timings with zero penalty!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
