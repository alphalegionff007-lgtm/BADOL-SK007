import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Trainer } from '../../types';
import TrainerCard from '../../components/website/TrainerCard';
import { ShieldAlert, BookOpenCheck } from 'lucide-react';

interface TrainersProps {
  onSuccessToast: (text: string) => void;
  whatsappNumber: string;
}

export default function Trainers({ onSuccessToast, whatsappNumber }: TrainersProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainers() {
      try {
        const data = await dbService.getTrainers(true);
        setTrainers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTrainers();
  }, []);

  const handleBook = (trainer: Trainer) => {
    onSuccessToast(`Opening chat with coach ${trainer.name}. Connecting via WhatsApp...`);
    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=Hello, I am interested in personal strength training under Elite Coach ${trainer.name} with Iron Elite Fitness. Please share timing availability.`, '_blank');
    }, 1000);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            Lifting Mentors
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Meet Our Certified Elite Coaches
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            Instructors at Iron Elite are fully accredited professionals containing years of practical bodybuilding, powerlifting coaching, ladies muscle recovery, and nutrition program design.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-zinc-500 text-center py-20 text-xs font-bold tracking-widest uppercase">
            Syncing roster boards...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} onBook={handleBook} />
            ))}
          </div>
        )}

        {/* Coactive Guidance Info */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 shadow-xl text-center md:text-left">
          <div className="p-4 bg-amber-500/10 border border-amber-500/15 rounded-2xl text-amber-500 shrink-0">
            <BookOpenCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 flex-grow">
            <h4 className="text-white font-bold text-sm uppercase tracking-wide">Included Diet Consultation cycles</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Every 3 Months or longer membership package includes **one complimentary, formal scientific diet assessment**. Your assigned coach checks your initial body fat metrics, establishes a caloric target, and drafts an elegant BDT-friendly food chart (e.g., egg whites, local oats, local fruits, boiled chicken).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
