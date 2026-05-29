import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GymPackage } from '../../types';
import { CheckCircle2, MessageSquare, PhoneCall, Gift, Loader2 } from 'lucide-react';

interface JoinFormProps {
  preselectedPackageName?: string;
  onSuccess: (toastMsg: string) => void;
  setHash: (hash: string) => void;
}

export default function JoinForm({ preselectedPackageName = '', onSuccess, setHash }: JoinFormProps) {
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [loadingPkg, setLoadingPkg] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [interestedPackage, setInterestedPackage] = useState(preselectedPackageName);
  const [preferredTime, setPreferredTime] = useState('Evening Batch');
  const [medicalNote, setMedicalNote] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  useEffect(() => {
    async function loadPkgs() {
      try {
        const data = await dbService.getPackages(true);
        setPackages(data);
        if (!interestedPackage && data.length > 0) {
          setInterestedPackage(data[0].name);
        }
      } catch (err) {
        console.error('Failed to load packages', err);
      } finally {
        setLoadingPkg(false);
      }
    }
    loadPkgs();
  }, []);

  // Update interested package when prop changes
  useEffect(() => {
    if (preselectedPackageName) {
      setInterestedPackage(preselectedPackageName);
    }
  }, [preselectedPackageName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await dbService.insertLead({
        full_name: fullName,
        phone,
        age: parseInt(age) || 20,
        gender,
        address,
        fitness_goal: fitnessGoal,
        interested_package: interestedPackage,
        preferred_time: preferredTime,
        medical_note: medicalNote,
        emergency_contact: emergencyContact
      });

      setSubmitted(true);
      onSuccess("Your Admission Lead registered successfully! We will contact you soon.");
    } catch (err) {
      console.error(err);
      alert('Error submitting lead. Please try again or call us immediately.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-2xl">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 shrink-0" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-white">Admission Request Submitted!</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            Assalamu Alaikum, <span className="text-white font-semibold">{fullName}</span>. We have securely registered your fitness lead in our system. An Executive Coach will call you within 12 hours.
          </p>
        </div>

        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-left max-w-md mx-auto space-y-3.5 text-xs">
          <p className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] text-amber-500 leading-none">Your Selection Summary</p>
          <div className="flex justify-between border-b border-zinc-900 pb-2 text-zinc-400">
            <span>Selected Plan:</span>
            <span className="text-white font-bold">{interestedPackage}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-900 pb-2 text-zinc-400">
            <span>Preferred Batch:</span>
            <span className="text-white font-bold">{preferredTime}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Admission Gate:</span>
            <span className="text-emerald-400 font-bold">PRE-REGISTERED OPEN</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto">
          <a
            href="https://wa.me/8801712345678"
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" /> Message WhatsApp
          </a>
          <button
            onClick={() => setHash('#home')}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full" />
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest mb-4">
          <Gift className="w-3.5 h-3.5" /> No Admission Fee for First 50 Leads!
        </div>
        <h3 className="text-2xl font-black text-white">Admission & Pre-Registration Form</h3>
        <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
          Fill in these metrics, and our specialist coach will contact you to assign your trainer shift. Let's begin building physical discipline.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Shakil Mahamud"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 017XXXXXXXX"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Row 2: Age, Gender, Emergency Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Age *</label>
            <input
              type="number"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="24"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Emergency Contact *</label>
            <input
              type="text"
              required
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="e.g. Father: 018XXXXXXXX"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-zinc-400 text-xs font-semibold mb-2">Address *</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. House 14, Road 4, Dhanmondi, Dhaka"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-zinc-400 text-xs font-semibold mb-2">Primary Fitness Goal *</label>
          <input
            type="text"
            required
            value={fitnessGoal}
            onChange={(e) => setFitnessGoal(e.target.value)}
            placeholder="e.g. Lose 10kg weight and develop athletic stamina"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Row 4: Interested Package & Preferred time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Interested Plan</label>
            {loadingPkg ? (
              <div className="text-zinc-500 text-xs py-3">Loading plans...</div>
            ) : (
              <select
                value={interestedPackage}
                onChange={(e) => setInterestedPackage(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} — ৳{p.price.toLocaleString('en-BD')}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Preferred Shift / Batch Time</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
            >
              <option value="Morning Batch">Morning Batch (06:00 AM - 11:00 AM)</option>
              <option value="Ladies Batch">Ladies Batch (11:00 AM - 04:00 PM)</option>
              <option value="Evening Batch">Evening Batch (04:00 PM - 09:00 PM)</option>
              <option value="Student Batch">Student Batch (09:00 AM - 03:00 PM)</option>
              <option value="Personal Training Batch">Custom Personal Training Hours</option>
            </select>
          </div>
        </div>

        {/* Medical note */}
        <div>
          <label className="block text-zinc-400 text-xs font-semibold mb-2">Medical Note / Past Injuries (If Any)</label>
          <textarea
            value={medicalNote}
            onChange={(e) => setMedicalNote(e.target.value)}
            placeholder="e.g. Mild lower back fatigue or knee issues, or type 'None'"
            rows={2}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Processing Application...
            </>
          ) : (
            <>
              Submit Admission Application <PhoneCall className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
