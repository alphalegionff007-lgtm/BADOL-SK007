import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GymSettings } from '../../types';
import { Save, Loader2, Landmark, CheckSquare, Info } from 'lucide-react';

interface SettingsProps {
  onSuccessToast: (text: string) => void;
}

export default function Settings({ onSuccessToast }: SettingsProps) {
  const [settings, setSettings] = useState<GymSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form bounds
  const [gymName, setGymName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [googleMapUrl, setGoogleMapUrl] = useState('');
  const [mainCtaText, setMainCtaText] = useState('Join Now');
  const [openingHours, setOpeningHours] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await dbService.getSettings();
        setSettings(data);
        
        // Populate inputs
        setGymName(data.gym_name);
        setHeroTitle(data.hero_title);
        setHeroSubtitle(data.hero_subtitle);
        setAddress(data.address);
        setPhone(data.phone);
        setEmail(data.email);
        setWhatsappNumber(data.whatsapp_number);
        setGoogleMapUrl(data.google_map_url || '');
        setMainCtaText(data.main_cta_text);
        setOpeningHours(data.opening_hours);
        setHeroImageUrl(data.hero_image_url || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    const payload: GymSettings = {
      ...settings,
      gym_name: gymName,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      address,
      phone,
      email,
      whatsapp_number: whatsappNumber,
      google_map_url: googleMapUrl,
      main_cta_text: mainCtaText,
      opening_hours: openingHours,
      hero_image_url: heroImageUrl
    };

    try {
      await dbService.updateSettings(payload);
      onSuccessToast('Gym Settings have been synchronized successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update Settings information properties.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">Syncing server specifications...</div>
    );
  }

  return (
    <div className="space-y-6 text-white p-2 text-left max-w-4xl">
      {/* Header */}
      <div className="border-b border-zinc-900 pb-5">
        <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Gym specifications Configurator</h2>
        <p className="text-zinc-500 text-xs mt-1">Configure physical branding titles, contact numbers, and SEO keywords configurations.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl shadow-xl">
        <form onSubmit={handleSave} className="space-y-5 text-zinc-300">
          
          <div className="flex gap-2.5 items-center border-b border-zinc-850 pb-3 text-amber-500">
            <Landmark className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">Branding Identity</h3>
          </div>

          {/* Row 1: Gym Name */}
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Gym Brand Center Name *</label>
            <input
              type="text"
              required
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex gap-2.5 items-center border-b border-zinc-850 pb-3 pt-6 text-amber-500">
            <Info className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">Landing Hero Content</h3>
          </div>

          {/* Row 2: Hero title & Sub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Hero main banner heading *</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Admission Banner CTA text *</label>
              <input
                type="text"
                required
                value={mainCtaText}
                onChange={(e) => setMainCtaText(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Hero details sub-caption *</label>
            <textarea
              required
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-830 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Hero Background Image URL *</label>
            <input
              type="text"
              required
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/..."
              className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
            />
            <p className="text-[10px] text-zinc-500 mt-1">Provide a high-quality landscape image URL (from Unsplash or any hosting service) for the main gym billboard background.</p>
          </div>

          <div className="flex gap-2.5 items-center border-b border-zinc-850 pb-3 pt-6 text-amber-500">
            <Landmark className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">Contact & Address properties</h3>
          </div>

          {/* Row 3: Hotlines, opening, maps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Hotline Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">WhatsApp support line *</label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 88017XXXXXXXX"
                className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Support Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Physical Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Opening shifts Schedule *</label>
              <input
                type="text"
                required
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Google maps iframe URL link */}
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Google Map iframe embed URL (https://www.google.com/maps/embed/...)</label>
            <input
              type="text"
              value={googleMapUrl}
              onChange={(e) => setGoogleMapUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action trigger footer */}
          <div className="flex justify-end pt-5 border-t border-zinc-850 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Synchronizing settings...
                </>
              ) : (
                <>
                  Sync Settings <Save className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
