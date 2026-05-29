import React from 'react';
import { 
  BarChart3, Users, ClipboardList, Package, UserSquare2, CalendarDays, 
  CreditCard, Image, MessageSquareQuote, Settings2, LogOut, Dumbbell 
} from 'lucide-react';
import { GymSettings } from '../../types';

interface AdminSidebarProps {
  currentPath: string;
  setHash: (hash: string) => void;
  onLogout: () => void;
  settings: GymSettings;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ 
  currentPath, setHash, onLogout, settings, sidebarOpen, setSidebarOpen 
}: AdminSidebarProps) {

  const menuItems = [
    { label: 'Overview', path: 'admin/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Members', path: 'admin/members', icon: <Users className="w-5 h-5" /> },
    { label: 'Leads Board', path: 'admin/leads', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'Packages', path: 'admin/packages', icon: <Package className="w-5 h-5" /> },
    { label: 'Trainers', path: 'admin/trainers', icon: <UserSquare2 className="w-5 h-5" /> },
    { label: 'Classes & Schedules', path: 'admin/classes', icon: <CalendarDays className="w-5 h-5" /> },
    { label: 'Payments', path: 'admin/payments', icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Gallery', path: 'admin/gallery', icon: <Image className="w-5 h-5" /> },
    { label: 'Testimonials', path: 'admin/testimonials', icon: <MessageSquareQuote className="w-5 h-5" /> },
    { label: 'Gym Settings', path: 'admin/settings', icon: <Settings2 className="w-5 h-5" /> },
  ];

  const handleNav = (path: string) => {
    setHash(`#${path}`);
    setSidebarOpen(false); // Auto close sidebar on mobile navigation
  };

  return (
    <>
      {/* Background overlay for mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="h-16 border-b border-zinc-900 flex items-center gap-2.5 px-6">
            <div className="bg-amber-500 p-1.5 rounded-lg text-zinc-950">
              <Dumbbell className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <span className="font-black text-sm tracking-widest text-white uppercase block">
                ADMIN <span className="text-amber-500">GATEWAY</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase leading-none block">
                {settings.gym_name}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all cursor-pointer ${
                    active 
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/65'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Bottom */}
        <div className="p-4 border-t border-zinc-900 space-y-3">
          <button
            onClick={() => handleNav('home')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl uppercase transition-colors cursor-pointer"
          >
            ← Public Website
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 rounded-xl uppercase transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
