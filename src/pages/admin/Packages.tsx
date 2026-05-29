import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GymPackage } from '../../types';
import { Plus, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';

export default function Packages() {
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<GymPackage | null>(null);

  // Form parameters
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [featuresInput, setFeaturesInput] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [colorTheme, setColorTheme] = useState('amber');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await dbService.getPackages();
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPkg(null);
    setName('');
    setPrice('');
    setDurationDays('30');
    setFeaturesInput('Free Locker Cabinets, Access 6 days/week, Certified Floor Coach, Compliment diet map');
    setIsActive(true);
    setColorTheme('amber');
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: GymPackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setPrice(String(pkg.price));
    setDurationDays(String(pkg.duration_days));
    setFeaturesInput(pkg.features.join(', '));
    setIsActive(pkg.is_active);
    setColorTheme(pkg.color_theme || 'amber');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete package plan: "${name}"? This will impact any members associated with this ID.`)) return;

    try {
      await dbService.deletePackage(id);
      setPackages(packages.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete package record.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const parsedFeatures = featuresInput
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const payload: any = {
      name,
      price: parseFloat(price) || 0,
      duration_days: parseInt(durationDays) || 30,
      features: parsedFeatures,
      is_active: isActive,
      color_theme: colorTheme,
      order_priority: 0
    };

    try {
      if (editingPkg) {
        await dbService.updatePackage(editingPkg.id, payload);
      } else {
        await dbService.insertPackage(payload);
      }
      setIsModalOpen(false);
      loadPackages();
    } catch (err) {
      console.error(err);
      alert('Error saving gym package details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-white p-2 text-left">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Lifting Package Setup Manager</h2>
          <p className="text-zinc-500 text-xs mt-1">Configure admission fees, duration days, and public pricing slots.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Price package
        </button>
      </div>

      {/* Package grid display */}
      {loading ? (
        <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">Syncing price panels...</div>
      ) : packages.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 p-16 rounded-3xl text-center max-w-md mx-auto space-y-3.5">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">No packages defined</h4>
          <p className="text-zinc-505 text-xs text-zinc-500">Add highly enticing membership options like Student packs or ladies recovery packages.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-zinc-900 border ${pkg.is_active ? 'border-zinc-800' : 'border-zinc-800 opacity-60'} rounded-3xl p-6 relative flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                    pkg.is_active ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-zinc-800 border border-zinc-705 text-zinc-500'
                  }`}>
                    {pkg.is_active ? 'Active on public site' : 'Draft mode'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-850 hover:text-white border border-zinc-805 text-zinc-400 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-rose-955 border border-zinc-805 text-rose-450 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-black text-white uppercase tracking-wider">{pkg.name}</h3>
                <div className="my-3.5 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-500 font-sans">৳{pkg.price.toLocaleString('en-BD')}</span>
                  <span className="text-[10px] text-zinc-550 lowercase font-semibold">/ {pkg.duration_days} days</span>
                </div>

                <ul className="space-y-1.5 text-zinc-450 text-xs border-t border-zinc-850/60 pt-4 mt-2">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 shrink-0 font-extrabold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 border-t border-zinc-850/60 mt-6 text-[10px] uppercase font-bold text-zinc-550 pl-0.5 flex items-center justify-between">
                <span>Theme: <strong className="text-white">{pkg.color_theme || 'amber'}</strong></span>
                <span>ID: <strong className="text-white font-mono lowercase">{pkg.id.slice(0, 10)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold uppercase text-white border-b border-zinc-805 pb-2 ml-0.5 leading-none">
              {editingPkg ? 'Edit Package option' : 'Add Price plan'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4.5 text-zinc-300">
              {/* Name */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ultra strength 3 Months Combo"
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Price and duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Price in BDT *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="৳4500"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Duration (Days) *</label>
                  <input
                    type="number"
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    placeholder="90"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none"
                  />
                </div>
              </div>

              {/* Color style Theme */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Visual card color accent</label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-350 focus:outline-none"
                >
                  <option value="amber">Amber Gold Accent</option>
                  <option value="blue">Blue Tech Accent</option>
                  <option value="emerald">Emerald Safety Accent</option>
                  <option value="rose">Rose Dynamic Accent</option>
                </select>
              </div>

              {/* Comma-separated features list */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Features (Comma Separated)</label>
                <textarea
                  required
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="e.g. Free Locker Cabinets, Access 6 days/week, Certified Coach"
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {/* is active switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveBox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-zinc-950 border-zinc-805 tracking-wide accent-amber-500"
                />
                <label htmlFor="isActiveBox" className="text-xs text-zinc-300 font-bold select-none cursor-pointer">
                  Activate & display on public website listings
                </label>
              </div>

              {/* Handles */}
              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl text-xs uppercase cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
