import React from 'react';
import { ShieldAlert, ShieldCheck, Dumbbell, Award, Landmark } from 'lucide-react';
import { GymSettings } from '../../types';

interface AboutProps {
  settings: GymSettings;
  setHash: (hash: string) => void;
}

export default function About({ settings, setHash }: AboutProps) {
  const safetyHighlights = [
    { title: 'Chamber Dust Control', desc: 'Heavy weight lifting creates chalk clouding. We run multiple smart filtration systems daily to retain dust-free workout zones.' },
    { title: 'Dedicated Ladies Slots safety', desc: 'Our ladies batch is completely secured from 11:00 AM - 4:00 PM with privacy blinds, operated strictly by certified female trainers.' },
    { title: 'Daily Machine Disinfection', desc: 'Every bench, dumbbell grip, and barbell sleeve is sanitized three times a day to maintain optimal sanitary conditions.' },
    { title: 'Imported Safety Collars & Racks', desc: 'All weight plates and heavy bars are equipped with specialized lock collars. Squat cages feature security straps.' }
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            About Our Gym
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Our Story & Core Fitness Mission
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            Establish physical robustness and deep structural discipline. Explore how Iron Elite Fitness became Dhaka's core center for lifting practitioners.
          </p>
        </div>

        {/* Story details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-amber-500 uppercase tracking-wide">
              Forged in Iron, Backed by Science
            </h3>
            <p className="text-zinc-300 text-xs leading-relaxed font-normal">
              Founded in 2021 in Dhanmondi, Dhaka, our gym was established to solve a critical issue: the lack of heavy powerlifting and certified bodybuilding equipment in a clean, professional, and accessible space.
            </p>
            <p className="text-zinc-400 text-xs leading-relaxed font-normal">
              We realized that standard gym slots were often crowded, lacked professional lifting plates, or failed to provide a safe, respectful slot for women. We built private ladies batches, and student packages to allow corporate workers and young lifters to level up without astronomical monthly costs.
            </p>

            <div className="border-l-4 border-amber-500 pl-4 py-1 italic text-xs text-zinc-350">
              "Gym training is not about luxury views; it is about proper biomechanics, heavy steel plates, certified trainers who check your lower spine arch, and a motivating community that fuels consistency."
            </div>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"
              alt="Gym Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-zinc-905 border border-zinc-900 p-6 md:p-8 rounded-3xl space-y-4 bg-zinc-900/40">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-500">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Our Mission</h3>
            <p className="text-zinc-455 text-xs font-normal leading-relaxed text-zinc-400">
              To democratise premium athletic fitness. We combine correct lifting biomechanics, certified coaches, and custom nutrition guides to empower every single member to attain outstanding physical resilience.
            </p>
          </div>

          <div className="bg-zinc-905 border border-zinc-900 p-6 md:p-8 rounded-3xl space-y-4 bg-zinc-900/40">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-500">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Our Vision</h3>
            <p className="text-zinc-455 text-xs font-normal leading-relaxed text-zinc-400">
              To establish permanent life-discipline in Dhaka. We aim to become the leading provider of safe ladies hours and university class strength templates, supporting health transformations for generations.
            </p>
          </div>
        </div>

        {/* Safety and Hygiene Focus */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-5 text-center md:text-left">
            <div>
              <span className="text-xs text-rose-500 font-bold uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
                <ShieldCheck className="w-4 h-4 shrink-0" /> Safety Core Policy
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide mt-1">
                Zero Compromise Safety & Hygiene Highlights
              </h3>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold font-mono">
              Last audited: May 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {safetyHighlights.map((s, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-zinc-200 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {s.title}
                </h4>
                <p className="text-zinc-400 text-xs leading-relaxed font-normal pl-3.5">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-zinc-905 border border-zinc-900 p-8 rounded-3xl text-center space-y-6 bg-zinc-900/45">
          <h3 className="text-xl md:text-2xl font-extrabold text-white">Join Our Supportive Fitness Family</h3>
          <p className="text-zinc-400 text-xs max-w-xl mx-auto leading-relaxed">
            Begin with a flat physical assessment. Learn correct push-up positions, check your knee safety during leg presses, and follow realistic home food patterns with us.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3.5 justify-center">
            <button
              onClick={() => setHash('#join')}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer"
            >
              Start Admission
            </button>
            <button
              onClick={() => setHash('#packages')}
              className="bg-transparent hover:bg-zinc-850 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest border border-zinc-800 cursor-pointer"
            >
              See Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
