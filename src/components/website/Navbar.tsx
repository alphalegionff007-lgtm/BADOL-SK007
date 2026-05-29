import React, { useState } from 'react';
import { Menu, X, Phone, Dumbbell } from 'lucide-react';
import { GymSettings } from '../../types';

interface NavbarProps {
  currentPath: string;
  setHash: (hash: string) => void;
  settings: GymSettings;
  isAdmin: boolean;
  onLogoutAdmin: () => void;
}

export default function Navbar({ currentPath, setHash, settings, isAdmin, onLogoutAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: 'home' },
    { label: 'About', path: 'about' },
    { label: 'Packages', path: 'packages' },
    { label: 'Trainers', path: 'trainers' },
    { label: 'Schedule', path: 'schedule' },
    { label: 'Gallery', path: 'gallery' },
    { label: 'BMI Calculator', path: 'bmi' },
    { label: 'Success Stories', path: 'testimonials' },
    { label: 'Contact', path: 'contact' }
  ];

  const handleNavClick = (path: string) => {
    setHash(`#${path}`);
    setIsOpen(false);
  };

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40 text-white">
      {/* Top mini-bar for local BD gym contact */}
      <div className="bg-amber-500 text-zinc-950 text-xs py-1.5 px-4 font-semibold tracking-wider flex justify-between items-center overflow-hidden">
        <span className="truncate">Dhaka's Premium Fitness Space & Ladies Batch</span>
        <div className="flex items-center gap-4 text-[11px] md:text-xs">
          <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:underline">
            <Phone className="w-3 h-3" /> {settings.phone}
          </a>
          <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noreferrer" className="hover:underline">
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0" onClick={() => handleNavClick('home')}>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-xl text-zinc-950 shadow-md shadow-amber-500/10 shrink-0">
              <Dumbbell className="w-5 h-5 md:w-6 md:h-6 transform -rotate-45" />
            </div>
            <div className="leading-none select-none">
              <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-wider uppercase text-white">
                {settings.gym_name.split(' ')[0]}
                <span className="text-amber-500"> {settings.gym_name.split(' ').slice(1).join(' ')}</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-zinc-900 border border-zinc-805 p-1 rounded-full px-1.5 shrink-0">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-2 xl:px-3 py-1.5 rounded-full text-[10px] xl:text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  currentPath === item.path
                    ? 'bg-amber-500 text-zinc-950 font-extrabold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setHash('#admin/dashboard')}
                  className="px-3 py-2 border border-amber-500/40 hover:border-amber-500 text-amber-400 rounded-xl text-[10px] xl:text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="px-3 py-2 text-zinc-400 hover:text-white rounded-xl text-[10px] xl:text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setHash('#admin/login')}
                  className="px-2 py-2 text-zinc-400 hover:text-white rounded-xl text-[10px] xl:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => handleNavClick('join')}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-[10px] xl:text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  Join Now
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex lg:hidden items-center gap-3">
            {!isAdmin && (
              <button
                onClick={() => handleNavClick('join')}
                className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs px-3.5 py-2 rounded-lg font-bold tracking-widest uppercase cursor-pointer"
              >
                Join
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none p-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-900 px-4 pt-3 pb-6 space-y-2 animate-fade-in text-center">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-colors text-left ${
                currentPath === item.path
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-zinc-900 my-4 pt-4 flex flex-col gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => {
                    setHash('#admin/dashboard');
                    setIsOpen(false);
                  }}
                  className="bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-xs uppercase"
                >
                  Admin Panel
                </button>
                <button
                  onClick={() => {
                    onLogoutAdmin();
                    setIsOpen(false);
                  }}
                  className="text-zinc-400 hover:text-white py-3 text-xs uppercase"
                >
                  Logout Admin
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setHash('#admin/login');
                    setIsOpen(false);
                  }}
                  className="text-zinc-400 hover:text-white py-2 text-xs uppercase"
                >
                  Admin Authorization Gate
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
