import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GymClass, Trainer } from '../../types';
import { Calendar, Filter, Clock, Flame, Users2 } from 'lucide-react';

interface ScheduleProps {
  setHash: (hash: string) => void;
}

export default function Schedule({ setHash }: ScheduleProps) {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');

  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const batchTypes = ['Morning Batch', 'Ladies Batch', 'Evening Batch', 'Student Batch', 'Personal Training Batch'];

  useEffect(() => {
    async function loadData() {
      try {
        const [clsData, trnData] = await Promise.all([
          dbService.getClasses(true),
          dbService.getTrainers(true)
        ]);
        setClasses(clsData);
        setTrainers(trnData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getTrainerName = (id: string) => {
    return trainers.find((t) => t.id === id)?.name || 'General Instructor';
  };

  const filteredClasses = classes.filter((c) => {
    const dayMatch = selectedDay === 'All' || c.day_of_week === selectedDay;
    const batchMatch = selectedBatch === 'All' || c.batch_type === selectedBatch;
    return dayMatch && batchMatch;
  });

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            Workouts planner
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Weekly Class Timetable
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            We operate in daily shifts. Check our structured weekly calendar to lock in your lifting session, power plate instructions, or ladies fat burn routines.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 border-b border-zinc-850 pb-3 mb-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Filter Workouts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Day Filter */}
            <div>
              <label className="block text-zinc-550 text-[10px] uppercase font-bold text-zinc-400 mb-1.5 pl-1.5">Weekday Filter</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs font-semibold text-zinc-350 focus:outline-none focus:border-amber-500 focus:text-white"
              >
                <option value="All">All Weekdays (Saturday - Friday)</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Batch Filter */}
            <div>
              <label className="block text-zinc-550 text-[10px] uppercase font-bold text-zinc-400 mb-1.5 pl-1.5">Shift Batch Type</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs font-semibold text-zinc-350 focus:outline-none focus:border-amber-500 focus:text-white"
              >
                <option value="All">All Batches (General, Ladies, Student, PT)</option>
                {batchTypes.map((batch) => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Display */}
        {loading ? (
          <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">
            Syncing timings calendar...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-16 text-center space-y-4 max-w-xl mx-auto">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">No matching classes found</h4>
            <p className="text-zinc-500 text-xs leading-normal">
              Try selection reset or explore all other slots. If you need custom times, pre-register for Personal Training.
            </p>
            <button
              onClick={() => {
                setSelectedDay('All');
                setSelectedBatch('All');
              }}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white hover:text-amber-500 text-[11px] font-bold rounded-lg border border-zinc-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4">
            {filteredClasses.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-805/80 rounded-2xl p-5 hover:border-zinc-700 transition-all shadow-md group flex flex-col justify-between"
              >
                <div>
                  {/* Day and Batch Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-amber-500/10 border border-amber-500/15 text-amber-500 font-bold px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest">
                      {item.day_of_week}
                    </span>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                      {item.batch_type}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider group-hover:text-amber-500 transition-colors mb-3">
                    {item.class_name}
                  </h3>

                  <div className="space-y-2 border-t border-zinc-850/80 pt-3.5 text-zinc-400 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{item.start_time} - {item.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Coach: {getTrainerName(item.trainer_id)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-850/80 pt-3 flex items-center justify-between mt-4 text-[10px] uppercase font-bold tracking-wider text-zinc-550 pl-0.5">
                  <div className="flex items-center gap-1.5">
                    <Users2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-400">Class Intake: <strong className="text-white">{item.capacity} Lifters</strong></span>
                  </div>
                  <button
                    onClick={() => setHash('#join')}
                    className="text-amber-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Enroll Class →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
