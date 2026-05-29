import React, { useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Loader2, Send } from 'lucide-react';

interface ContactFormProps {
  onSuccess: (msg: string) => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interestedPackage, setInterestedPackage] = useState('Monthly Plan');
  const [preferredTime, setPreferredTime] = useState('Evening Batch');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await dbService.insertLead({
        full_name: name,
        phone,
        age: 25,
        gender: 'Male',
        address: 'Dhaka Local',
        fitness_goal: 'General Enquiry',
        interested_package: interestedPackage,
        preferred_time: preferredTime,
        medical_note: `Contact Form Message: ${message}`,
        emergency_contact: 'N/A'
      });

      onSuccess('Message sent successfully! Our representative will phone you shortly.');
      setName('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-xl mx-auto shadow-xl">
      <h3 className="text-xl font-bold text-white mb-2">Send Us a Message</h3>
      <p className="text-zinc-400 text-xs font-normal mb-6">
        Got questions about ladies hours, fees, or trainer schedules? Message us directly and we will phone you right back.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-zinc-400 text-xs font-semibold mb-2">Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Asif Ur Rahman"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
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
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Interested Package</label>
            <select
              value={interestedPackage}
              onChange={(e) => setInterestedPackage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
            >
              <option value="Monthly Plan">Monthly Plan</option>
              <option value="3 Months Plan">3 Months Plan</option>
              <option value="6 Months Plan">6 Months Plan</option>
              <option value="Yearly Plan">Yearly Plan</option>
              <option value="Student Package">Student Package</option>
              <option value="Ladies Batch Plan">Ladies Batch Plan</option>
              <option value="Personal Training Plan">Personal Training</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Preferred Shift</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
            >
              <option value="Morning Batch">Morning Batch</option>
              <option value="Ladies Batch">Ladies Batch</option>
              <option value="Evening Batch">Evening Batch</option>
              <option value="Student Batch">Student Batch</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-xs font-semibold mb-2">Your Message *</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your questions here..."
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Sending Message...
            </>
          ) : (
            <>
              Send Inquiry Message <Send className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
