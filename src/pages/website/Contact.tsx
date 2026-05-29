import React from 'react';
import ContactForm from '../../components/website/ContactForm';
import { GymSettings } from '../../types';
import { MapPin, Phone, Mail, Clock, MessageSquare, CreditCard } from 'lucide-react';

interface ContactProps {
  settings: GymSettings;
  onSuccessToast: (msg: string) => void;
}

export default function Contact({ settings, onSuccessToast }: ContactProps) {
  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Contact Our Gym Location
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            Located in the heart of Dhanmondi. Reach out via mobile hotline, send an enquiry on WhatsApp, or pay us a visit for a physical facility guide.
          </p>
        </div>

        {/* Column split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Detail cards */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold uppercase text-white tracking-wide border-b border-zinc-900 pb-3">
                Business & Contact Identifications
              </h3>

              <div className="space-y-4.5">
                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Facility Address</h4>
                    <p className="text-white text-xs mt-1 leading-relaxed font-semibold">
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Hotlines */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Mobile Hotline</h4>
                    <p className="text-white text-xs mt-1 leading-relaxed font-semibold">
                      <a href={`tel:${settings.phone}`} className="hover:underline hover:text-amber-400">
                        {settings.phone}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-500 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Support Email</h4>
                    <p className="text-white text-xs mt-1 leading-relaxed font-semibold break-all">
                      <a href={`mailto:${settings.email}`} className="hover:underline hover:text-amber-400">
                        {settings.email}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Opening Schedule</h4>
                    <p className="text-white text-xs mt-1 leading-relaxed font-semibold">
                      {settings.opening_hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments disclaimer */}
            <div className="bg-zinc-900 border border-zinc-805/80 p-5 rounded-2xl flex items-start gap-4 shadow-md">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/15 rounded-xl text-amber-500 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-xs uppercase tracking-wide">Mobile payment lines</h4>
                <p className="text-zinc-450 text-[11px] leading-relaxed text-zinc-400">
                  We accept fee collections via **bKash (Merchant Pay), Nagad, and Rocket** or via Cash at our main counter. If paying remotely, make sure to insert your Member ID or phone inside the transaction reference field.
                </p>
              </div>
            </div>
          </div>

          {/* Contact form right pane */}
          <ContactForm onSuccess={onSuccessToast} />
        </div>

        {/* Google Map Box */}
        {settings.google_map_url && (
          <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden border border-zinc-850 bg-zinc-900 aspect-video md:aspect-[21/9] shadow-xl relative">
            <iframe
              src={settings.google_map_url}
              className="w-full h-full border-none opacity-85 hover:opacity-100 transition-opacity"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map embed Dhanmondi Dhaka"
            />
          </div>
        )}
      </div>
    </div>
  );
}
