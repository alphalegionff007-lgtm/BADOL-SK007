import React from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, MessageCircle, Heart, Dumbbell } from 'lucide-react';
import { GymSettings } from '../../types';

interface FooterProps {
  setHash: (hash: string) => void;
  settings: GymSettings;
}

export default function Footer({ setHash, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setHash('#home')}>
            <div className="bg-amber-500 p-2 rounded-xl text-zinc-950">
              <Dumbbell className="w-5 h-5 transform -rotate-45" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-white uppercase">
              {settings.gym_name.split(' ')[0]}
              <span className="text-amber-500"> {settings.gym_name.split(' ').slice(1).join(' ')}</span>
            </span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed font-normal">
            Elevating physical limits in Bangladesh with dedicated training routines, premium imported power racks, ladies-only shifts, and tailored nutritional coaching.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href={settings.facebook_link || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 transition-all text-zinc-400"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={settings.instagram_link || 'https://instagram.com'}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 transition-all text-zinc-400"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 transition-all text-zinc-400"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6 border-l-2 border-amber-500 pl-3">
            Quick Links
          </h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li>
              <button onClick={() => setHash('#home')} className="hover:text-amber-400 transition-colors cursor-pointer text-zinc-400">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setHash('#about')} className="hover:text-amber-400 transition-colors cursor-pointer text-zinc-400">
                About Our Gym
              </button>
            </li>
            <li>
              <button onClick={() => setHash('#packages')} className="hover:text-amber-400 transition-colors cursor-pointer text-zinc-400">
                Membership Plans
              </button>
            </li>
            <li>
              <button onClick={() => setHash('#trainers')} className="hover:text-amber-400 transition-colors cursor-pointer text-zinc-400">
                Certified Trainers
              </button>
            </li>
            <li>
              <button onClick={() => setHash('#schedule')} className="hover:text-amber-400 transition-colors cursor-pointer text-zinc-400">
                Weekly Timetable
              </button>
            </li>
            <li>
              <button onClick={() => setHash('#bmi')} className="hover:text-amber-400 transition-colors cursor-pointer text-zinc-400">
                Healthy BMI Meter
              </button>
            </li>
          </ul>
        </div>

        {/* Timing */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6 border-l-2 border-amber-500 pl-3">
            Opening Hours
          </h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-200 font-semibold">Weekly Timetable</p>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {settings.opening_hours}
                </p>
              </div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl">
              <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">Ladies Exclusive Hours</p>
              <p className="text-sm text-zinc-100 font-medium mt-1">Saturday - Thursday</p>
              <p className="text-xs text-zinc-400">11:00 AM to 4:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6 border-l-2 border-amber-500 pl-3">
            Get In Touch
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-zinc-300 leading-relaxed font-normal">{settings.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <a href={`tel:${settings.phone}`} className="text-zinc-300 hover:text-white transition-colors">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <a href={`mailto:${settings.email}`} className="text-zinc-300 hover:text-white transition-colors truncate">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-zinc-500 font-medium">&copy; {currentYear} {settings.gym_name}. All rights reserved.</p>
        <p className="text-zinc-500 flex items-center gap-1.5 font-medium">
          Durable Cloud Host & Premium local support in Bangladesh. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" />
        </p>
      </div>
    </footer>
  );
}
