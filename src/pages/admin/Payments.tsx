import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { Payment, Member } from '../../types';
import { Plus, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  // Form parameters
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer'>('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'failed' | 'refunded'>('paid');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [payList, mList] = await Promise.all([
        dbService.getPayments(),
        dbService.getMembers()
      ]);
      setPayments(payList);
      setMembers(mList);
      if (mList.length > 0 && !memberId) {
        setMemberId(mList[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPayment(null);
    if (members.length > 0) {
      setMemberId(members[0].id);
    }
    setAmount('2500');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('bKash');
    setTransactionId('BKX_98239A');
    setPaymentStatus('paid');
    setIsModalOpen(true);
  };

  const openEditModal = (payItem: Payment) => {
    setEditingPayment(payItem);
    setMemberId(payItem.member_id);
    setAmount(String(payItem.amount));
    setPaymentDate(payItem.payment_date);
    setPaymentMethod(payItem.payment_method);
    setTransactionId(payItem.transaction_id || '');
    setPaymentStatus(payItem.payment_status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently erase this ledger transition entry?')) return;

    try {
      await dbService.deletePayment(id);
      setPayments(payments.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete payment log.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Omit<Payment, 'id' | 'created_at'> = {
      member_id: memberId,
      amount: parseFloat(amount) || 0,
      payment_date: paymentDate,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      payment_status: paymentStatus
    };

    try {
      if (editingPayment) {
        await dbService.updatePayment(editingPayment.id, payload);
      } else {
        await dbService.insertPayment(payload);
        
        // Bonus: If inserting a SUCCESSFUL payment, let's auto-update the relevant member's payment_status to 'paid'!
        if (paymentStatus === 'paid') {
          await dbService.updateMember(memberId, {
            payment_status: 'paid',
            member_status: 'active'
          });
        }
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save payment transition log.');
    } finally {
      setSaving(false);
    }
  };

  const getPayerName = (id: string) => {
    return members.find(m => m.id === id)?.full_name || 'Generic Lifter';
  };

  return (
    <div className="space-y-6 text-white p-2 text-left">
      {/* Header & Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Accounting Payments Ledger</h2>
          <p className="text-zinc-500 text-xs mt-1">Audit cash registrations, verify bKash merchant IDs, and balance dues.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Log Member Payment
        </button>
      </div>

      {/* Ledger Table lists */}
      {loading ? (
        <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">Syncing finance ledgers...</div>
      ) : payments.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 p-16 rounded-3xl text-center max-w-sm mx-auto space-y-3.5">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">No transaction logged</h4>
          <p className="text-zinc-505 text-xs text-zinc-500">Log some payments to trigger stats widgets metrics on the home boards.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-950/80 uppercase tracking-widest text-zinc-500 font-extrabold border-b border-zinc-805">
                <tr>
                  <th className="p-4 pl-6">Payer Lifter</th>
                  <th className="p-4">Paid Date</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Transaction Reference ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-805/80 font-medium text-zinc-300">
                {payments.map((pItem) => (
                  <tr key={pItem.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="p-4 pl-6 font-extrabold text-white text-sm uppercase tracking-wide">
                      {getPayerName(pItem.member_id)}
                      <span className="block text-[10px] text-zinc-500 font-normal lowercase tracking-normal">
                        Internal ID: {pItem.member_id.slice(0, 12)}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-zinc-250">{pItem.payment_date}</td>
                    <td className="p-4">
                      <span className="font-extrabold text-white bg-zinc-950 px-2.5 py-1 rounded border border-zinc-805 uppercase tracking-wider text-[10px]">
                        {pItem.payment_method}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold uppercase text-zinc-350">{pItem.transaction_id || 'Cash Direct payment'}</td>
                    <td className="p-4 font-sans text-emerald-400 text-sm font-black">৳{pItem.amount.toLocaleString('en-BD')}</td>
                    <td className="p-4">
                      <StatusBadge status={pItem.payment_status} />
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditModal(pItem)}
                          className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-850 hover:text-white border border-zinc-805 text-zinc-400 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pItem.id)}
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

      {/* CRUD Modal dialog form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-zinc-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold uppercase text-white border-b border-zinc-805 pb-2 ml-0.5 leading-none">
              {editingPayment ? 'Edit Ledger Entrance' : 'Record Member dues'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4.5 text-zinc-300">
              {/* Member Assign Selector */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Select Paying Member</label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount in BDT */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Amount Paid in BDT *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Transaction Date *</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Method & Transaction ID split */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-350 focus:outline-none"
                  >
                    <option value="Cash">Cash at Counter</option>
                    <option value="bKash">bKash (Mobile)</option>
                    <option value="Nagad">Nagad (Mobile)</option>
                    <option value="Rocket">Rocket (Mobile)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Wallet Trx ID / Ref</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Ref or Cash ID"
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Payment ledger Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="paid">paid / Verified</option>
                  <option value="pending">pending Dues</option>
                  <option value="failed">failed Payment</option>
                  <option value="refunded">refunded Payment</option>
                </select>
              </div>

              {/* Actions */}
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
                  {saving ? 'Saving...' : 'Verify payment log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
