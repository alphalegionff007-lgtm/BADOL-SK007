import React from 'react';
import { Calendar, Award, Phone } from 'lucide-react';
import { Trainer } from '../../types';

interface TrainerCardProps {
  key?: any;
  trainer: Trainer;
  onBook: (trainer: Trainer) => void;
}

export default function TrainerCard({ trainer, onBook }: TrainerCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:border-zinc-700 transition-all group flex flex-col h-full">
      {/* Photo Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
        <img
          src={trainer.photo_url || trainer.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600'}
          alt={trainer.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Glow tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
        
        {/* Specialty badge */}
        <span className="absolute bottom-4 left-4 bg-amber-500 text-zinc-950 font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider shadow-lg">
          {trainer.specialty || (trainer.specialties ? trainer.specialties.join(', ') : 'Coaching')}
        </span>
      </div>

      {/* Body Info */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
            {trainer.name}
          </h3>
          
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{trainer.experience} Experience</span>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed font-normal mb-5 line-clamp-3">
            {trainer.bio || 'General fitness companion committed to elevating muscle profiles through certified custom nutrition lists and posture cycles.'}
          </p>
        </div>

        <div>
          {/* Timings info */}
          <div className="border-t border-zinc-800/80 pt-4 mb-4">
            <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-medium leading-none mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Shift Timings</span>
            </div>
            <p className="text-zinc-200 text-xs font-semibold pl-5.5">{trainer.available_time || trainer.shifts}</p>
          </div>

          {/* Call/WhatsApp Booking CTA */}
          <button
            onClick={() => onBook(trainer)}
            className="w-full bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-zinc-700 hover:border-amber-500 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" /> Speak with Trainer
          </button>
        </div>
      </div>
    </div>
  );
}
