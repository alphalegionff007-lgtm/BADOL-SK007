import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Lead } from '../../types';
import { Search, Edit, Trash2, CheckCircle2, UserCheck, X, AlertCircle, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal controls
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form bounds
  const [status, setStatus] = useState<'new' | 'contacted' | 'converted' | 'rejected'>('new');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await dbService.getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setStatus(lead.status);
    setAdminNote(lead.admin_note || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete lead for "${name}"?`)) return;

    try {
      await dbService.deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete lead.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    setSaving(true);

    try {
      await dbService.updateLead(editingLead.id, {
        status,
        admin_note: adminNote
      });
      setIsModalOpen(false);
      loadLeads();
    } catch (err) {
      console.error(err);
      alert('Error updating lead status.');
    } finally {
      setSaving(false);
    }
  };

  // Convert Lead directly to Active Gym Member
  const handleConvert = async (lead: Lead) => {
    if (!confirm(`Convert lead "${lead.full_name}" directly into a verified gym member? This will calculate admission start dates.`)) return;

    setLoading(true);
    try {
      // Find package matching lead's interested package
      const pkgs = await dbService.getPackages();
      const matchedPkg = pkgs.find(p => p.name.toLowerCase() === lead.interested_package.toLowerCase() || p.id === lead.interested_package) 
        || pkgs[0] 
        || { id: 'pkg_monthly', duration_days: 30 };

      const startDate = new Date().toISOString().split('T')[0];
      const endDateVal = new Date();
      endDateVal.setDate(endDateVal.getDate() + (matchedPkg.duration_days || 30));
      const calculatedEnd = endDateVal.toISOString().split('T')[0];

      // Insert member
      await dbService.insertMember({
        full_name: lead.full_name,
        phone: lead.phone,
        age: lead.age,
        gender: lead.gender,
        address: lead.address,
        fitness_goal: lead.fitness_goal,
        package_id: matchedPkg.id,
        membership_start: startDate,
        membership_end: calculatedEnd,
        payment_status: 'pending', // member created first, payment details set separately
        member_status: 'active',
        emergency_contact: lead.emergency_contact,
        medical_note: lead.medical_note || 'Converted Lead details'
      });

      // Update lead status to 'converted'
      await dbService.updateLead(lead.id, {
        status: 'converted',
        admin_note: `Client converted to active membership on ${startDate}.`
      });

      alert(`Lead "${lead.full_name}" converted successfully! Member is now active with pending dues.`);
      loadLeads();
    } catch (err) {
      console.error(err);
      alert('Failed to complete conversions.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const textMatch = l.full_name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const statusMatch = statusFilter === 'All' || l.status === statusFilter;
    return textMatch && statusMatch;
  });

  return (
    <div className="space-y-6 text-white p-2 text-left">
      {/* Header */}
      <div className="border-b border-zinc-900 pb-5">
        <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Admission Action Leads Board</h2>
        <p className="text-zinc-500 text-xs mt-1">Audit public admissions, mark contacted steps, and activate memberships.</p>
      </div>

      {/* Searcing filters */}
      <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name or phone..."
            className="w-full bg-zinc-950 border border-zinc-805 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-650 focus:outline-none"
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-2.5 text-xs text-zinc-350 focus:outline-none"
        >
          <option value="All">All Inbound Leads</option>
          <option value="new">new Actions</option>
          <option value="contacted">contacted Leads</option>
          <option value="converted">converted Members</option>
          <option value="rejected">rejected Pipeline</option>
        </select>
      </div>

      {/* Leads representation */}
      {loading ? (
        <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">Synchronizing pipelines...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 p-16 rounded-3xl text-center max-w-md mx-auto space-y-3.5">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">No leads found</h4>
          <p className="text-zinc-505 text-xs text-zinc-500 leading-normal">Pipeline is currently empty. Website pre-registrations will show up here.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-950/80 uppercase tracking-widest text-zinc-500 font-extrabold border-b border-zinc-805">
                <tr>
                  <th className="p-4 pl-6">Client Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Shift Batch</th>
                  <th className="p-4">Staff Note</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Pipeline Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-805/80 font-medium text-zinc-300">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="p-4 pl-6 font-extrabold text-white text-sm uppercase tracking-wide">
                      {lead.full_name}
                      <span className="block text-[10px] text-zinc-500 lowercase mt-0.5 font-normal tracking-normal font-sans">
                        Age: {lead.age} • Goal: {lead.fitness_goal}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-350 font-mono">{lead.phone}</td>
                    <td className="p-4 font-semibold">{lead.interested_package}</td>
                    <td className="p-4">{lead.preferred_time}</td>
                    <td className="p-4 max-w-[180px] truncate italic text-zinc-400">
                      {lead.admin_note || 'No custom notes logged'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {lead.status !== 'converted' && (
                          <button
                            onClick={() => handleConvert(lead)}
                            className="p-2 rounded-lg bg-zinc-950 hover:bg-emerald-950/40 border border-zinc-805 hover:border-emerald-900 text-emerald-450 hover:text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
                            title="Convert directly to member"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(lead)}
                          className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-805 text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id, lead.full_name)}
                          className="p-2 rounded-lg bg-zinc-950 hover:bg-rose-955 border border-zinc-805 hover:border-rose-900 text-zinc-400 hover:text-rose-400 cursor-pointer"
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

      {/* Edit lead notation modal layout */}
      {isModalOpen && editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold uppercase text-white border-b border-zinc-805 pb-2.5 tracking-wide leading-none">
              Inbound Actions: {editingLead.full_name}
            </h3>

            <form onSubmit={handleSave} className="space-y-5 text-zinc-300">
              {/* Status selectors */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Pipeline Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="new">new Admission Action</option>
                  <option value="contacted">contacted Client</option>
                  <option value="converted">converted Member Account</option>
                  <option value="rejected">rejected Pipeline</option>
                </select>
              </div>

              {/* staff administrative note */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Administrative Notes / SMS Logs</label>
                <textarea
                  required
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Called client on bKash dues status, scheduled Dhanmondi spot visits."
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs uppercase cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold rounded-xl text-xs uppercase cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Update Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
