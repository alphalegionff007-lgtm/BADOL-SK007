import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GymSettings, GymPackage, Trainer, Testimonial } from '../../types';
import { 
  Dumbbell, Shield, Users, Heart, ArrowRight, Zap, Target, 
  CheckCircle2, Flame, HelpCircle 
} from 'lucide-react';
import PackageCard from '../../components/website/PackageCard';
import TrainerCard from '../../components/website/TrainerCard';
import TestimonialCard from '../../components/website/TestimonialCard';
import BMICalculator from '../../components/website/BMICalculator';

interface HomeProps {
  setHash: (hash: string) => void;
  settings: GymSettings;
  setPreselectedPackage: (pkg: string) => void;
  onSuccessToast: (text: string) => void;
}

export default function Home({ setHash, settings, setPreselectedPackage, onSuccessToast }: HomeProps) {
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pkgs, trns, tsts] = await Promise.all([
          dbService.getPackages(true),
          dbService.getTrainers(true),
          dbService.getTestimonials(true)
        ]);
        setPackages(pkgs.slice(0, 3)); // show first 3 packages on home page preview
        setTrainers(trns.slice(0, 3)); // show max 3 trainers on home preview
        setTestimonials(tsts.slice(0, 2)); // show first 2 success stories on home preview
      } catch (err) {
        console.error('Failed to pre-fetch website home entities.', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePackageJoin = (pkgName: string) => {
    setPreselectedPackage(pkgName);
    setHash('#join');
  };

  const handleTrainerBooking = (trainer: Trainer) => {
    onSuccessToast(`Opening booking routing with Elite Coach ${trainer.name}. Connecting via WhatsApp...`);
    setTimeout(() => {
      window.open(`https://wa.me/${settings.whatsapp_number}?text=Hello, I would like to booking personal guidance with Coach ${trainer.name}`, '_blank');
    }, 1000);
  };

  const facilities = [
    { title: 'Imported Power Racks', desc: 'Premium multi-racks & heavy lifting chalk zones for squats, deadlifts, and military presses.', icon: <Flame className="w-6 h-6 text-amber-500" /> },
    { title: 'Safe Ladies Batches', desc: 'Secure shifts operated strictly by certified female training experts.', icon: <Users className="w-6 h-6 text-amber-500" /> },
    { title: 'Advanced Cardio Deck', desc: 'Full range of high-efficiency curved treadmills, air bikes, and stairmasters.', icon: <Zap className="w-6 h-6 text-amber-500" /> },
    { title: 'Diet & Supplement Guides', desc: 'Complimentary weight metrics checks and customized nutrition charts.', icon: <Target className="w-6 h-6 text-amber-500" /> }
  ];

  const highlights = [
    { title: 'Full Access 6 days/week', text: 'Spacious floor plan open from 6:00 AM to 10:00 PM.' },
    { title: 'Highly Qualified Elite Coaches', text: 'Certified coaches specializing in bodybuilding and physical therapies.' },
    { title: 'Clean and Posture Focused', text: 'Sterilized locker cabinets, modern soundscapes, and clean indoor air filters.' }
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden border-b border-zinc-900/40">
        {/* Ambient backing shapes */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full" />

        {/* Hero image backing */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-zinc-950/85 z-10" />
          <img
            src={settings.hero_image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"}
            alt="Gym Hero Background"
            className="w-full h-full object-cover opacity-35"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-zinc-850 rounded-full text-xs font-bold uppercase tracking-widest text-amber-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Dhaka's Professional Strength Center
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none">
            {settings.hero_title}
          </h1>

          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            {settings.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 pt-4">
            <button
              onClick={() => setHash('#join')}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-amber-500/25 transition-all text-center cursor-pointer"
            >
              {settings.main_cta_text}
            </button>
            <button
              onClick={() => setHash('#packages')}
              className="w-full sm:w-auto bg-zinc-900/85 hover:bg-zinc-800 border border-zinc-805 text-white font-bold px-8 py-4 rounded-2xl text-xs uppercase tracking-widest transition-colors text-center cursor-pointer"
            >
              View Packages
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-amber-550 text-xs font-bold uppercase tracking-widest">Built For Results</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1.5 font-sans mb-6">
              Why Local Members Trust Our Fitness Center
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              We do not larp about fitness. Our gym is a fully functional steel club designed securely for Dhanmondi lifting candidates, students, and corporate individuals searching for serious physique alterations and cardiovascular durability.
            </p>

            <div className="space-y-4">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">{h.title}</h4>
                    <p className="text-zinc-500 text-xs mt-1 leading-normal">{h.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-zinc-850 aspect-[4/3] bg-zinc-900 group">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
              alt="Gym Floor"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-2xl font-black text-white">Dedicated Power Racks Area</p>
              <p className="text-zinc-400 text-xs mt-1">Imported strength gear designed for maximum bone densities and hypertrophy cycles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GYM FACILITIES */}
      <section className="py-20 bg-zinc-900/30 border-y border-zinc-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-550 text-xs font-bold uppercase tracking-widest">Modern Infrastructure</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1.5 mb-12">
            Top Tier Fitness Facilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {facilities.map((fac, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl space-y-4 shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-500 shadow-inner">
                  {fac.icon}
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wide">{fac.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-normal">{fac.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PACKAGES PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-amber-550 text-xs font-bold uppercase tracking-widest font-sans">Transparent Pricing</span>
        <h2 className="text-2xl md:text-3xl font-black text-white mt-1.5 mb-4">
          Flexible Membership Packages
        </h2>
        <p className="text-zinc-400 text-xs max-w-xl mx-auto mb-16 leading-relaxed">
          No hidden fees or complex contracts. Standard, student friendly pricing designed directly to accommodate Dhaka's gym candidates.
        </p>

        {loading ? (
          <div className="text-zinc-500 py-10 text-xs">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch pt-4 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} onJoin={handlePackageJoin} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => setHash('#packages')}
            className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-400 font-bold text-xs uppercase tracking-widest pb-1 border-b border-amber-500/40 cursor-pointer"
          >
            See All Packages & Student Pricing <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. TRAINERS PREVIEW */}
      <section className="py-20 bg-zinc-900/30 border-t border-zinc-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-550 text-xs font-bold uppercase tracking-widest">Expert Guidance</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1.5 mb-4">
            Meet Our Certified Elite Coaches
          </h2>
          <p className="text-zinc-400 text-xs max-w-xl mx-auto mb-16 leading-relaxed">
            Every coach on our floor holds physical training credentials, prioritizing joint safety, structural posture correction, and hyper-accelerated weight reduction.
          </p>

          {loading ? (
            <div className="text-zinc-500 py-10 text-xs">Syncing coaches...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {trainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} onBook={handleTrainerBooking} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => setHash('#trainers')}
              className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-400 font-bold text-xs uppercase tracking-widest pb-1 border-b border-amber-500/40 cursor-pointer"
            >
              View Full Trainer Shifts schedule <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. BMI CALCULATOR SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900/40">
        <div className="text-center mb-12">
          <span className="text-amber-550 text-xs font-bold uppercase tracking-widest">Immediate Diagnosis</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1.5 mb-2">BMI Health Calculator</h2>
        </div>
        <BMICalculator onJoinClick={() => setHash('#join')} />
      </section>

      {/* 7. TRANSFORMATION / SUCCESS STORIES PREVIEW */}
      {testimonials.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-550 text-xs font-bold uppercase tracking-widest">Real Transformations</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1.5 mb-4">
            Lifting Stories & Member Accomplishments
          </h2>
          <p className="text-zinc-400 text-xs max-w-xl mx-auto mb-16 leading-relaxed">
            Real individuals from Dhaka who restored their health, lost heavy visceral fat, and built permanent life discipline in our facility.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setHash('#testimonials')}
              className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-400 font-bold text-xs uppercase tracking-widest pb-1 border-b border-amber-500/40 cursor-pointer"
            >
              See All Before/After Success Stories <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* 8. GENERAL CONTACT CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-950 text-center relative overflow-hidden">
        {/* Subtle geometric circles */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-zinc-950/5 blur-xl rounded-full" />
        <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none">
            Are You Ready To Level Up Your Physique?
          </h2>
          <p className="text-zinc-950/80 text-xs md:text-sm font-semibold max-w-2xl mx-auto leading-relaxed">
            Pre-register your admission today. No initial admission fee. Receive a complimentary initial workout sheet, metabolic diagnosis, and dietary chart upon enrollment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4.5 pt-4">
            <button
              onClick={() => setHash('#join')}
              className="bg-zinc-950 text-white hover:bg-zinc-900 font-extrabold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg"
            >
              Apply Online Now
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all text-center border-2 border-white cursor-pointer"
            >
              WhatsApp Assistant
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
