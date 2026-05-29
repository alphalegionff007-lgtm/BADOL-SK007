import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GymClass, Trainer } from '../../types';
import { Plus, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';

export default function Classes() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);

  // Form parameters
  const [className, setClassName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Saturday');
  const [startTime, setStartTime] = useState('06:00 AM');
  const [endTime, setEndTime] = useState('07:30 AM');
  const [trainerId, setTrainerId] = useState('');
  const [batchType, setBatchType] = useState('Morning Batch');
  const [capacity, setCapacity] = useState('20');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysList = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const batchTypes = ['Morning Batch', 'Ladies Batch', 'Evening Batch', 'Student Batch', 'Personal Training Batch'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clsData, trnData] = await Promise.all([
        dbService.getClasses(),
        dbService.getTrainers()
      ]);
      setClasses(clsData);
      setTrainers(trnData);
      if (trnData.length > 0 && !trainerId) {
        setTrainerId(trnData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingClass(null);
    setClassName('');
    setDayOfWeek('Saturday');
    setStartTime('06:00 AM');
    setEndTime('07:30 AM');
    if (trainers.length > 0) {
      setTrainerId(trainers[0].id);
    }
    setBatchType('Morning Batch');
    setCapacity('20');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (clsItem: GymClass) => {
    setEditingClass(clsItem);
    setClassName(clsItem.class_name);
    setDayOfWeek(clsItem.day_of_week);
    setStartTime(clsItem.start_time);
    setEndTime(clsItem.end_time);
    setTrainerId(clsItem.trainer_id);
    setBatchType(clsItem.batch_type);
    setCapacity(String(clsItem.capacity));
    setIsActive(clsItem.is_active);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete class: "${name}"?`)) return;

    try {
      await dbService.deleteClass(id);
      setClasses(classes.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete class.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Omit<GymClass, 'id' | 'created_at'> = {
      class_name: className,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      trainer_id: trainerId,
      batch_type: batchType,
      capacity: parseInt(capacity) || 20,
      is_active: isActive
    };

    try {
      if (editingClass) {
        await dbService.updateClass(editingClass.id, payload);
      } else {
        await dbService.insertClass(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save Class information details.');
    } finally {
      setSaving(false);
    }
  };

  const getTrainerName = (id: string) => {
    return trainers.find(t => t.id === id)?.name || 'General Inspector';
  };

  return (
    <div className="space-y-6 text-white p-2 text-left">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Workout Classes & Timetable</h2>
          <p className="text-zinc-500 text-xs mt-1">Configure shifts, weekdays calendar indexes, and capacity limitations.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Workout Class
        </button>
      </div>

      {/* Main schedule table registry */}
      {loading ? (
        <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">Syncing class calendar boards...</div>
      ) : classes.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 p-16 rounded-3xl text-center max-w-sm mx-auto space-y-3.5">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">No classes defined</h4>
          <p className="text-zinc-505 text-xs text-zinc-500">Add highly exciting workouts slots like Strength hypertrophy, ladies aerobics, or student lifting basics.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-950/80 uppercase tracking-widest text-zinc-500 font-extrabold border-b border-zinc-805">
                <tr>
                  <th className="p-4 pl-6">Class Name</th>
                  <th className="p-4">Day of Week</th>
                  <th className="p-4">Time Interval</th>
                  <th className="p-4">Batch Category</th>
                  <th className="p-4">Floor Coach</th>
                  <th className="p-4">Capacity limit</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-805/80 font-medium text-zinc-300">
                {classes.map((clsItem) => (
                  <tr key={clsItem.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="p-4 pl-6 font-extrabold text-white text-sm uppercase tracking-wide">
                      {clsItem.class_name}
                      <span className="block text-[10px] text-zinc-500 lowercase mt-0.5 font-normal tracking-normal font-sans">
                        Status: <strong className={clsItem.is_active ? 'text-amber-500' : 'text-zinc-600'}>{clsItem.is_active ? 'Visible' : 'Draft'}</strong>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-amber-500/10 border border-amber-500/15 text-amber-500 font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-wide">
                        {clsItem.day_of_week}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-zinc-250">{clsItem.start_time} - {clsItem.end_time}</td>
                    <td className="p-4 text-zinc-400 font-bold">{clsItem.batch_type}</td>
                    <td className="p-4 text-zinc-300 font-semibold">{getTrainerName(clsItem.trainer_id)}</td>
                    <td className="p-4 font-mono font-bold text-white">{clsItem.capacity} Slot-intakes</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditModal(clsItem)}
                          className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-850 hover:text-white border border-zinc-805 text-zinc-400 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(clsItem.id, clsItem.class_name)}
                          className="p-1.5 rounded-lg bg-zinc-950 hover:bg-rose-955 border border-zinc-805 text-rose-455 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Modal dialog container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold uppercase text-white border-b border-zinc-805 pb-2 ml-0.5 leading-none">
              {editingClass ? 'Edit Workouts Class' : 'Define Workout entry'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-zinc-305">
              {/* Name */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Class / Workouts Name *</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Compound Powerlifting squats Checkup"
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none"
                />
              </div>

              {/* Day of Week & Batch category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Day of Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-350 focus:outline-none"
                  >
                    {daysList.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Batch Shift category</label>
                  <select
                    value={batchType}
                    onChange={(e) => setBatchType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-355 focus:outline-none"
                  >
                    {batchTypes.map((batch) => (
                      <option key={batch} value={batch}>{batch}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start and end times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="e.g. 06:00 AM"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">End Time *</label>
                  <input
                    type="text"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="e.g. 07:30 AM"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Trainer assign & intake capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Assign Coach</label>
                  <select
                    value={trainerId}
                    onChange={(e) => setTrainerId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-350 focus:outline-none"
                  >
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Intake Limit *</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="25"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* is active status checkbox */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-850 pt-3">
                <input
                  type="checkbox"
                  id="classActiveValue"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-amber-500 bg-zinc-950 border-zinc-805 accent-amber-500 rounded"
                />
                <label htmlFor="classActiveValue" className="text-xs font-bold text-zinc-300 select-none cursor-pointer">
                  Activate & display class timings on website calendar
                </label>
              </div>

              {/* handles */}
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
                  {saving ? 'Saving...' : 'Save Class entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
