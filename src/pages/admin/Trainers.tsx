import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Trainer } from '../../types';
import { Plus, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  // Form parameters
  const [name, setName] = useState('');
  const [specialtiesInput, setSpecialtiesInput] = useState('');
  const [certificationsInput, setCertificationsInput] = useState('');
  const [bio, setBio] = useState('');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');
  const [shifts, setShifts] = useState('Morning & Evening');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    try {
      const data = await dbService.getTrainers();
      setTrainers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTrainer(null);
    setName('');
    setSpecialtiesInput('SBD Coaching, Cardio, Weight Reduction, Posture Repairs');
    setCertificationsInput('World Fitness Academy accreditation, Dhaka Athletic Level 1');
    setBio('Professional physical educator with major records in state powerlifting.');
    setContact('017XXXXXXXX');
    setImageUrl('');
    setCloudinaryPublicId('');
    setShifts('Morning & Evening');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setName(trainer.name);
    setSpecialtiesInput(trainer.specialties.join(', '));
    setCertificationsInput(trainer.certifications.join(', '));
    setBio(trainer.bio);
    setContact(trainer.contact);
    setImageUrl(trainer.image_url);
    setCloudinaryPublicId(trainer.cloudinary_public_id || '');
    setShifts(trainer.shifts);
    setIsActive(trainer.is_active);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you extremely sure you want to dismiss coach record: "${name}"? This removes scheduling configurations.`)) return;

    try {
      await dbService.deleteTrainer(id);
      setTrainers(trainers.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete trainer.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const parsedSpecialties = specialtiesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const parsedCertifications = certificationsInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const payload: any = {
      name,
      specialties: parsedSpecialties,
      bio,
      certifications: parsedCertifications,
      contact,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&auto=format&fit=crop&q=60',
      cloudinary_public_id: cloudinaryPublicId,
      shifts,
      is_active: isActive
    };

    try {
      if (editingTrainer) {
        await dbService.updateTrainer(editingTrainer.id, payload);
      } else {
        await dbService.insertTrainer(payload);
      }
      setIsModalOpen(false);
      loadTrainers();
    } catch (err) {
      console.error(err);
      alert('Error updating floor coach particulars.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSuccess = (url: string, publicId: string) => {
    setImageUrl(url);
    setCloudinaryPublicId(publicId);
  };

  return (
    <div className="space-y-6 text-white p-2 text-left">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Floor Coaches Roster Board</h2>
          <p className="text-zinc-500 text-xs mt-1">Configure trainer parameters, Specialties, certifications, and shift allocations.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Floor Coach
        </button>
      </div>

      {/* Trainers Listing */}
      {loading ? (
        <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">Syncing coaches rosters...</div>
      ) : trainers.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-855 p-16 rounded-3xl text-center max-w-sm mx-auto space-y-3.5">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">No coaches enrolled</h4>
          <p className="text-zinc-505 text-xs text-zinc-500">Configure floor trainers to allocate class timetables and support student guidance.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className={`bg-zinc-900 border ${trainer.is_active ? 'border-zinc-800' : 'border-zinc-800 opacity-60'} rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between`}
            >
              <div>
                <div className="aspect-[4/3] relative bg-zinc-950/80">
                  <img
                    src={trainer.image_url}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-transparent" />
                  
                  {/* Actions on top of image */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(trainer)}
                      className="p-2 bg-zinc-900/90 text-zinc-300 hover:text-white rounded-lg border border-zinc-700/50 cursor-pointer shadow"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(trainer.id, trainer.name)}
                      className="p-2 bg-zinc-900/90 text-zinc-300 hover:text-rose-400 rounded-lg border border-zinc-700/50 cursor-pointer shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-amber-500 text-zinc-950 text-[9px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {trainer.shifts}
                    </span>
                    <h3 className="text-base font-black text-white uppercase tracking-wider mt-1.5">{trainer.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Specialties</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {trainer.specialties.map((spec, sIdx) => (
                        <span key={sIdx} className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-[10px] px-2.5 py-1 rounded-md">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Certifications</h4>
                    <ul className="text-zinc-400 text-[10px] leading-relaxed list-disc list-inside mt-1 font-semibold space-y-0.5">
                      {trainer.certifications.map((cert, cIdx) => (
                        <li key={cIdx}>{cert}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-zinc-400 text-[11px] leading-relaxed italic">{trainer.bio}</p>
                </div>
              </div>

              <div className="p-5 border-t border-zinc-850/60 bg-zinc-950/40 flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500 font-mono">
                <span>LINE: <strong className="text-white">{trainer.contact}</strong></span>
                <span>STATUS: <strong className={trainer.is_active ? 'text-emerald-400' : 'text-zinc-600'}>{trainer.is_active ? 'ACTIVE' : 'DRAFT'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Overlay container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-zinc-900 border border-zinc-850 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold uppercase text-white border-b border-zinc-805 pb-2.5 tracking-wide leading-none">
              {editingTrainer ? 'Modify Coach Particulars' : 'Add Floor Mentor'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-zinc-300">
              {/* Row 1: Image Uploader */}
              <ImageUploader
                label="Coach Profile Photo"
                initialImageUrl={imageUrl}
                onUploadSuccess={handleUploadSuccess}
              />

              {/* Name */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Coach Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Coach Shakil Mahamud"
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none"
                />
              </div>

              {/* Contact & Shifts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Contact Hotline *</label>
                  <input
                    type="tel"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Shifts availability *</label>
                  <input
                    type="text"
                    required
                    value={shifts}
                    onChange={(e) => setShifts(e.target.value)}
                    placeholder="Morning & Evening Slots"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none"
                  />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Specialties (Comma Separated) *</label>
                <input
                  type="text"
                  required
                  value={specialtiesInput}
                  onChange={(e) => setSpecialtiesInput(e.target.value)}
                  placeholder="Bodybuilding, Squating posture checking, weight loss guide"
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Certifications & Accreditations (Comma Separated) *</label>
                <input
                  type="text"
                  required
                  value={certificationsInput}
                  onChange={(e) => setCertificationsInput(e.target.value)}
                  placeholder="Dhaka Physical Institute Level 2, CPR/AED Safety First Certified"
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Biography */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Coach Short Bio *</label>
                <textarea
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Provide short credentials, coaching approach, and accomplishments milestones."
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-850 pt-3">
                <input
                  type="checkbox"
                  id="coachActiveSwitch"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-amber-500 bg-zinc-950 border-zinc-805 accent-amber-500 rounded"
                />
                <label htmlFor="coachActiveSwitch" className="text-xs font-bold text-zinc-300 select-none cursor-pointer">
                  Activate and display profile on public roster boards
                </label>
              </div>

              {/* Actions footer */}
              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold rounded-xl text-xs uppercase cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Coach Particulars'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
