import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Testimonial } from '../../types';
import { Plus, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form parameters
  const [name, setName] = useState('');
  const [beforeUrl, setBeforeUrl] = useState('');
  const [beforePublicId, setBeforePublicId] = useState('');
  const [afterUrl, setAfterUrl] = useState('');
  const [afterPublicId, setAfterPublicId] = useState('');
  const [storyText, setStoryText] = useState('');
  const [weightMetric, setWeightMetric] = useState('12 kg Fat Lost');
  const [monthsCount, setMonthsCount] = useState('4');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await dbService.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } opacity:
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingTestimonial(null);
    setName('');
    setBeforeUrl('');
    setBeforePublicId('');
    setAfterUrl('');
    setAfterPublicId('');
    setStoryText('Shed massive visceral fat, gained extreme mobility, and corrected SBD lifting postures.');
    setWeightMetric('12 kg fat lost');
    setMonthsCount('4');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setName(t.name);
    setBeforeUrl(t.before_image_url);
    setBeforePublicId(t.before_image_public_id || '');
    setAfterUrl(t.after_image_url);
    setAfterPublicId(t.after_image_public_id || '');
    setStoryText(t.story_text);
    setWeightMetric(t.weight_metric);
    setMonthsCount(String(t.months_count));
    setIsActive(t.is_active);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (!confirm(`Are you sure you want to permanently erase success story card of: "${clientName}"?`)) return;

    try {
      await dbService.deleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete story element.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeUrl || !afterUrl) {
      alert('Highly critical visual error: Dual Before/After images are required.');
      return;
    }
    setSaving(true);

    const payload: any = {
      name,
      before_image_url: beforeUrl,
      before_image_public_id: beforePublicId,
      after_image_url: afterUrl,
      after_image_public_id: afterPublicId,
      story_text: storyText,
      weight_metric: weightMetric,
      months_count: parseInt(monthsCount) || 4,
      is_active: isActive
    };

    try {
      if (editingTestimonial) {
        await dbService.updateTestimonial(editingTestimonial.id, payload);
      } else {
        await dbService.insertTestimonial(payload);
      }
      setIsModalOpen(false);
      loadTestimonials();
    } catch (err) {
      console.error(err);
      alert('Failed to save transformation logs.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-white p-2 text-left">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Member Success Transformations Board</h2>
          <p className="text-zinc-500 text-xs mt-1">Configure side-by-side Before/After results, fat lost counts, and personal story files.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Success Story
        </button>
      </div>

      {/* Grid of testimonials */}
      {loading ? (
        <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">Syncing transformations rosters...</div>
      ) : testimonials.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 p-16 rounded-3xl text-center max-w-sm mx-auto space-y-3.5">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">No transformations registered</h4>
          <p className="text-zinc-505 text-xs text-zinc-500">Add physical before/after files to motivate young lifting candidates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-zinc-900 border ${t.is_active ? 'border-zinc-800' : 'border-zinc-800 opacity-60'} rounded-3xl p-6 shadow-md space-y-5 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-550 text-amber-500 bg-amber-500/10 border border-amber-500/15 text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {t.months_count} Months Transformation
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-850 hover:text-white border border-zinc-805 text-zinc-400 cursor-pointer shadow"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-rose-955 border border-zinc-805 hover:border-rose-900 text-rose-455 hover:text-rose-400 cursor-pointer shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Overlying side by side dual photos */}
                <div className="grid grid-cols-2 gap-4 h-[160px] md:h-[200px] rounded-2xl overflow-hidden bg-zinc-950/40 relative">
                  {/* Before */}
                  <div className="relative overflow-hidden group">
                    <img
                      src={t.before_image_url}
                      alt="Before"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <span className="absolute bottom-2 left-2 bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide">
                      BEFORE
                    </span>
                  </div>

                  {/* After */}
                  <div className="relative overflow-hidden group">
                    <img
                      src={t.after_image_url}
                      alt="After"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="absolute bottom-2 right-2 bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide">
                      AFTER
                    </span>
                  </div>
                </div>

                <div className="text-left space-y-1.5">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">{t.name}</h3>
                  <p className="text-amber-500 text-xs font-mono font-black uppercase tracking-wide">Metric: {t.weight_metric}</p>
                  <p className="text-zinc-400 text-xs leading-relaxed italic">"{t.story_text}"</p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-850 bg-zinc-900 flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500 font-mono">
                <span>Display: <strong className={t.is_active ? 'text-emerald-400' : 'text-zinc-600'}>{t.is_active ? 'YES' : 'NO'}</strong></span>
                <span>ID: <strong className="text-zinc-400 lowercase">{t.id.slice(0, 10)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal overlay container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-zinc-900 border border-zinc-850 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl overflow-y-auto max-h-[95vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-zinc-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold uppercase text-white border-b border-zinc-805 pb-2 ml-0.5 leading-none">
              {editingTestimonial ? 'Edit Success story' : 'Add Transformation Card'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-zinc-300">
              {/* Name */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">LIFTER CLIENT NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shakil Mahamud"
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Dual image uploader split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Before Photo (Required)"
                  initialImageUrl={beforeUrl}
                  onUploadSuccess={(url, id) => {
                    setBeforeUrl(url);
                    setBeforePublicId(id);
                  }}
                />
                <ImageUploader
                  label="After Photo (Required)"
                  initialImageUrl={afterUrl}
                  onUploadSuccess={(url, id) => {
                    setAfterUrl(url);
                    setAfterPublicId(id);
                  }}
                />
              </div>

              {/* Metric and Weight split */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">FAT COST / MASS ACCRUED *</label>
                  <input
                    type="text"
                    required
                    value={weightMetric}
                    onChange={(e) => setWeightMetric(e.target.value)}
                    placeholder="e.g. 14kg Visceral Fat Lost"
                    className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">TRAINING TIMESPAN (MONTHS) *</label>
                  <input
                    type="number"
                    required
                    value={monthsCount}
                    onChange={(e) => setMonthsCount(e.target.value)}
                    placeholder="4"
                    className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Story Description Textarea */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Member Story Description *</label>
                <textarea
                  required
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="Tell how physical coaches corrected postering, mapped diet cycles, and pushed compound volume totals."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-855 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Active list checkmark */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-850 pt-3">
                <input
                  type="checkbox"
                  id="testimonialActiveState"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-amber-500 bg-zinc-950 border-zinc-805 accent-amber-500 rounded"
                />
                <label htmlFor="testimonialActiveState" className="text-xs font-bold text-zinc-300 select-none cursor-pointer">
                  Activate & display on public transformations section
                </label>
              </div>

              {/* handles */}
              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-850 hover:bg-zinc-850 text-zinc-400 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl text-xs uppercase cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Pin story card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
