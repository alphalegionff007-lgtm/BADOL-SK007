import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Testimonial } from '../../types';
import TestimonialCard from '../../components/website/TestimonialCard';
import { Award, MessageSquare } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await dbService.getTestimonials(true);
        setTestimonials(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            Lifting Stories
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Member Physical Transformations
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            We celebrate structural triumphs! Explore how our members shed fat, gained dense muscle profiles, healed metabolic diseases, and solidified physical discipline.
          </p>
        </div>

        {/* List items */}
        {loading ? (
          <div className="text-zinc-500 text-center py-20 text-xs font-bold tracking-widest uppercase">
            Syncing transformations registry...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center max-w-md mx-auto space-y-4">
            <MessageSquare className="w-12 h-12 text-zinc-650 mx-auto" />
            <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest">No testimonies found</h4>
            <p className="text-zinc-500 text-xs leading-normal">
              Stories panel is currently clean. Admin can insert physical success cards inside the dashboard panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}

        {/* Localized Encouragement Block */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 shadow-xl text-center sm:text-left">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/15 rounded-2xl text-amber-500 shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide">Are you an active Iron Elite Lifter?</h4>
            <p className="text-zinc-400 text-xs leading-relaxed mt-1">
              Have you lost fat, gained dense mass, or significantly escalated your deadlift or squat totals inside our facility? Email your before/after files to your coach or upload them in the dashboard to inspire young Bangladeshi lifting candidates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
