import React from 'react';
import BMICalculator from '../../components/website/BMICalculator';
import { ShieldCheck, HeartPulse, Scale } from 'lucide-react';

interface BMIPageProps {
  setHash: (hash: string) => void;
}

export default function BMI({ setHash }: BMIPageProps) {
  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            Metabolic Meter
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Healthy Body Mass Index (BMI)
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            Lifting heavy weights requires understanding body compositions. Compute your BMI instantly to discover if you require calorie bulking, student strength schedules, or specialized ladies cardio intervals.
          </p>
        </div>

        {/* Calculator Widget wrapper */}
        <BMICalculator onJoinClick={() => setHash('#join')} />

        {/* Dynamic medical explanations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6 text-left">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/15 rounded-xl flex items-center justify-center text-amber-500">
              <Scale className="w-4 h-4" />
            </div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">What does BMI measure?</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              BMI checks your weight ratio against height metrics to indicate if your systemic load is underweight, normal, overweight, or obese. It serves as an instant health baseline.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/15 rounded-xl flex items-center justify-center text-amber-500">
              <HeartPulse className="w-4 h-4" />
            </div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Custom workout mapping</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              If your score is Overweight/Obese, our coaches configure lower-impact squats, knee safety grips, and low-carb keto structures. If Underweight, we map heavy compound hypertrophies.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/15 rounded-xl flex items-center justify-center text-amber-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Complimentary full assessment</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Every admission submission qualifies for a **free localized in-person body composition assessment** (muscle weight, bone densities, water levels) during your initial facility tours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
