import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Member, GymPackage } from '../../types';
import { Search, Plus, Edit, Trash2, X, AlertCircle, Loader2, Filter } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pkgFilter, setPkgFilter] = useState('All');

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form bounds
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [packageId, setPackageId] = useState('');
  const [membershipStart, setMembershipStart] = useState(new Date().toISOString().split('T')[0]);
  const [membershipEnd, setMembershipEnd] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'failed' | 'refunded'>('paid');
  const [memberStatus, setMemberStatus] = useState<'active' | 'expired' | 'pending' | 'blocked'>('active');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalNote, setMedicalNote] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mList, pList] = await Promise.all([
        dbService.getMembers(),
        dbService.getPackages()
      ]);
      setMembers(mList);
      setPackages(pList);
      if (pList.length > 0 && !packageId) {
        setPackageId(pList[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto calculate membership end date based on package selection days
  useEffect(() => {
    if (!packageId || !membershipStart) return;
    const selectedPkg = packages.find(p => p.id === packageId);
    if (!selectedPkg) return;

    const startDate = new Date(membershipStart);
    startDate.setDate(startDate.getDate() + selectedPkg.duration_days);
    setMembershipEnd(startDate.toISOString().split('T')[0]);
  }, [packageId, membershipStart, packages]);

  const openAddModal = () => {
    setEditingMember(null);
    setFullName('');
    setPhone('');
    setAge('24');
    setGender('Male');
    setAddress('');
    setFitnessGoal('');
    if (packages.length > 0) {
      setPackageId(packages[0].id);
    }
    setMembershipStart(new Date().toISOString().split('T')[0]);
    setPaymentStatus('paid');
    setMemberStatus('active');
    setEmergencyContact('');
    setMedicalNote('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFullName(member.full_name);
    setPhone(member.phone);
    setAge(String(member.age));
    setGender(member.gender);
    setAddress(member.address);
    setFitnessGoal(member.fitness_goal || '');
    setPackageId(member.package_id);
    setMembershipStart(member.membership_start);
    setMembershipEnd(member.membership_end);
    setPaymentStatus(member.payment_status);
    setMemberStatus(member.member_status);
    setEmergencyContact(member.emergency_contact);
    setMedicalNote(member.medical_note || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you extremely sure you want to delete member: "${name}"? This physical operation cannot be undone.`)) return;

    try {
      await dbService.deleteMember(id);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting member record.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Omit<Member, 'id' | 'created_at'> = {
      full_name: fullName,
      phone,
      age: parseInt(age) || 24,
      gender,
      address,
      fitness_goal: fitnessGoal,
      package_id: packageId,
      membership_start: membershipStart,
      membership_end: membershipEnd,
      payment_status: paymentStatus,
      member_status: memberStatus,
      emergency_contact: emergencyContact,
      medical_note: medicalNote,
    };

    try {
      if (editingMember) {
        await dbService.updateMember(editingMember.id, payload);
      } else {
        await dbService.insertMember(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving member registry file.');
    } finally {
      setSaving(false);
    }
  };

  const getPackageName = (id: string) => {
    return packages.find((p) => p.id === id)?.name || 'General Access';
  };

  // Search & Filter computation
  const filteredMembers = members.filter((m) => {
    const textMatch =
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);
    const statusMatch = statusFilter === 'All' || m.member_status === statusFilter;
    const pkgMatch = pkgFilter === 'All' || m.package_id === pkgFilter;
    return textMatch && statusMatch && pkgMatch;
  });

  return (
    <div className="space-y-6 text-white p-2 text-left">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Member Registry Management</h2>
          <p className="text-zinc-500 text-xs mt-1">Configure active plans, admission dates, and medical logs.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Gym Member
        </button>
      </div>

      {/* Searching & filters boards */}
      <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full bg-zinc-950 border border-zinc-805 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-650" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-grow bg-zinc-950 border border-zinc-805 rounded-xl px-3.5 py-2.5 text-xs text-zinc-350 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="expired">Expired Members</option>
            <option value="pending">Pending Members</option>
            <option value="blocked">Blocked Members</option>
          </select>
        </div>

        {/* Package Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-650" />
          <select
            value={pkgFilter}
            onChange={(e) => setPkgFilter(e.target.value)}
            className="flex-grow bg-zinc-950 border border-zinc-805 rounded-xl px-3.5 py-2.5 text-xs text-zinc-350 focus:outline-none"
          >
            <option value="All">All Packages</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="text-zinc-505 text-center py-20 text-xs font-bold tracking-widest uppercase">Fetching member registry records...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 p-16 rounded-3xl text-center max-w-md mx-auto space-y-3.5">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">No matching members found</h4>
          <p className="text-zinc-500 text-xs leading-normal">Click Add Member above to registers your first gym client.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-950/80 uppercase tracking-widest text-zinc-500 font-extrabold border-b border-zinc-805">
                <tr>
                  <th className="p-4 pl-6">Full Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Package</th>
                  <th className="p-4 text-center">Timings (Start/End)</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-805/80 font-medium">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="p-4 pl-6 font-extrabold text-white text-sm uppercase tracking-wide">
                      {member.full_name}
                      <span className="block text-[10px] text-zinc-500 lowercase mt-0.5 font-normal tracking-normal font-sans">
                        Age: {member.age} • Gender: {member.gender}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-300 font-mono tracking-wide">{member.phone}</td>
                    <td className="p-4">{getPackageName(member.package_id)}</td>
                    <td className="p-4 text-center">
                      <span className="text-zinc-350 block">{member.membership_start}</span>
                      <span className="text-zinc-550 block mt-0.5 text-[10px] font-bold text-rose-500">End: {member.membership_end}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${
                        member.payment_status === 'paid' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-450 text-rose-450'
                      }`}>
                        {member.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={member.member_status} />
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex gap-2.5">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-805 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.full_name)}
                          className="p-2 rounded-lg bg-zinc-950 hover:bg-rose-950/40 border border-zinc-805 hover:border-rose-900 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
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

      {/* Add / Edit CRUD Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold uppercase text-white border-b border-zinc-805 pb-2.5 tracking-wide leading-none">
              {editingMember ? 'Modify Member record' : 'Register New Member'}
            </h3>

            <form onSubmit={handleSave} className="space-y-5 text-zinc-300">
              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Shakil Mahamud"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Age, Gender, Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Age *</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="26"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Emergency Contact *</label>
                  <input
                    type="text"
                    required
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Father: 018XXXXXXXX"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 3: Address & Gym goals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Residence Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House 12, Dhanmondi, Dhaka"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Primary Fitness Goal</label>
                  <input
                    type="text"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    placeholder="Lose 12kg and build dense muscle"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 4: Package & Membership Start date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Membership Package</label>
                  <select
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (৳{p.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={membershipStart}
                    onChange={(e) => setMembershipStart(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Calculated End Date</label>
                  <input
                    type="date"
                    disabled
                    value={membershipEnd}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 5: Payment status & Membership status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Payment Dues Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="paid">paid (Dues Resolved)</option>
                    <option value="pending">pending (Dues Unresolved)</option>
                    <option value="failed">failed</option>
                    <option value="refunded">refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Admissions status</label>
                  <select
                    value={memberStatus}
                    onChange={(e) => setMemberStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="active">Active Plan</option>
                    <option value="expired">expired Plan</option>
                    <option value="pending">pending Authorization</option>
                    <option value="blocked">blocked Account</option>
                  </select>
                </div>
              </div>

              {/* Medical notes */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Medical Notes / Spine past injuries / Cautions</label>
                <textarea
                  value={medicalNote}
                  onChange={(e) => setMedicalNote(e.target.value)}
                  placeholder="e.g. Mild knee joint weakness during heavy leg extensions, or type 'None'"
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Action handles */}
              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs uppercase cursor-pointer"
                >
                  Discard Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold rounded-xl text-xs uppercase flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>Save Client Record</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
