import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialCardProps {
  key?: any;
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const ratingStars = Array.from({ length: testimonial.rating || 5 }, (_, i) => i);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-all shadow-xl group">
      <div>
        {/* Before / After Dual Image Structure */}
        {testimonial.after_image_url && (
          <div className="grid grid-cols-2 gap-3 mb-6 relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
            {/* Before image */}
            <div className="relative aspect-[3/4] overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-300">
              {testimonial.before_image_url ? (
                <img
                  src={testimonial.before_image_url}
                  alt="Before Transformation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center px-2">
                  No Image Selected
                </div>
              )}
              <span className="absolute bottom-2.5 left-2.5 bg-zinc-950/80 backdrop-blur-md text-zinc-400 font-bold px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider">
                Before
              </span>
            </div>

            {/* After image */}
            <div className="relative aspect-[3/4] overflow-hidden border-l border-zinc-800">
              <img
                src={testimonial.after_image_url}
                alt="After Transformation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-2.5 left-2.5 bg-amber-500 text-zinc-950 font-bold px-2.5 py-0.5 rounded-md text-[9px] uppercase tracking-widest shadow-md">
                After
              </span>
            </div>
          </div>
        )}

        {/* Big Bold Result Accent */}
        <div className="bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-xl mb-5 text-center">
          <p className="text-amber-500 text-xs font-extrabold uppercase tracking-wide">
            {testimonial.result_summary || `${testimonial.weight_metric} (${testimonial.months_count} Months)`}
          </p>
        </div>

        {/* testimonial details */}
        <div className="relative">
          <Quote className="w-8 h-8 text-zinc-800 absolute -top-4 -left-3 shrink-0" />
          <p className="text-zinc-300 text-xs font-normal leading-relaxed relative z-10 pl-5 mb-6 italic">
            "{testimonial.story || testimonial.story_text}"
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-between mt-auto">
        <div>
          <h4 className="text-white font-bold text-sm leading-tight">{testimonial.member_name || testimonial.name}</h4>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Verified Iron Elite Member</p>
        </div>
        
        {/* Rating */}
        <div className="flex gap-0.5">
          {ratingStars.map((idx) => (
            <Star key={idx} className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
