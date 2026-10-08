import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import { PaymentMode, SaruwaRecord } from '../types';
import {
  HandCoins,
  Search,
  CheckCircle,
  Clock,
  Receipt,
  FileSpreadsheet,
  X,
  ExternalLink,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { exportToExcel } from '../utils/export';
import { formatReceiptWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp';

export const SaruwaCollectionView: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    records,
    getCaseStats,
    recordSaruwaPayment,
    revertSaruwaToPending,
    openReceiptForRecord,
    settings,
  } = useSaruwa();

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const caseStats = currentCase ? getCaseStats(currentCase.id) : null;

  // Filter and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');

  // Modal to record payment
  const [recordingRecord, setRecordingRecord] = useState<SaruwaRecord | null>(null);
  const [paymentForm, setPaymentForm] = useState<{
    saruwaAmount: number;
    paymentMode: PaymentMode;
    paymentDate: string;
    remarks: string;
    receiptNumber: string;
  }>({
    saruwaAmount: currentCase?.defaultSaruwaAmount || settings.defaultSaruwaAmount || 530,
    paymentMode: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: '',
    receiptNumber: '',
  });

  const caseRecords = records.filter((r) => r.caseId === currentCase?.id);

  const filteredRecords = caseRecords.filter((r) => {
    const matchesSearch =
      r.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.mobileNumber.includes(searchQuery) ||
      (r.receiptNumber && r.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenRecord = (record: SaruwaRecord) => {
    setRecordingRecord(record);
    setPaymentForm({
      saruwaAmount: record.saruwaAmount || currentCase?.defaultSaruwaAmount || settings.defaultSaruwaAmount || 530,
      paymentMode: record.paymentMode || 'Cash',
      paymentDate: record.paymentDate || new Date().toISOString().split('T')[0],
      remarks: record.remarks || '',
      receiptNumber: record.receiptNumber || '',
    });
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingRecord) return;

    recordSaruwaPayment(recordingRecord.id, {
      saruwaAmount: Number(paymentForm.saruwaAmount) || 530,
      paymentMode: paymentForm.paymentMode,
      paymentDate: paymentForm.paymentDate,
      remarks: paymentForm.remarks,
      receiptNumber: paymentForm.receiptNumber.trim() || undefined,
    });

    setRecordingRecord(null);
  };

  const handleExportExcel = () => {
    if (!currentCase) return;
    const exportData = caseRecords.map((r, idx) => ({
      'Sl. No.': idx + 1,
      'Member ID': r.memberId,
      'Member Name': r.memberName,
      'Mobile Number': r.mobileNumber,
      'Saruwa Amount (₹)': r.saruwaAmount,
      'Payment Status': r.status,
      'Payment Date': r.paymentDate || 'N/A',
      'Payment Mode': r.paymentMode || 'N/A',
      'Receipt Number': r.receiptNumber || 'N/A',
      'Remarks': r.remarks || '',
    }));
    exportToExcel(
      exportData,
      `Saruwa_Collection_${currentCase.id}_${currentCase.deceasedName.replace(/[^a-zA-Z0-9]/g, '_')}`,
      'Saruwa Collection'
    );
  };

  if (!currentCase) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
        No Saruwa cases available. Please create a New Saruwa Case first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Case Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
              {currentCase.id}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                currentCase.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {currentCase.status} Case
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif mt-1">
            Saruwa Collection: {currentCase.deceasedName}
          </h2>
          <p className="text-xs text-stone-500">
            Family: <strong>{currentCase.familyMemberName}</strong> · Contact: {currentCase.contactPerson} ({currentCase.contactNumber})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Switch Case dropdown */}
          <div className="relative">
            <select
              value={currentCase.id}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-stone-300 rounded-xl text-xs text-black font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}: {c.deceasedName} ({c.status})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
            title="Export Collection to Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {/* 4 Automatic Live Calculations for this Case */}
      {caseStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Total Saruwa Collected */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">
              Total Saruwa Collected
            </span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-950 font-mono mt-1">
              {settings.currencySymbol}
              {caseStats.totalCollected.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-700 block mt-0.5">
              Cash: ₹{caseStats.cashAmount} · UPI: ₹{caseStats.upiAmount} · Bank: ₹{caseStats.bankAmount}
            </span>
          </div>

          {/* 2. Total Members Paid */}
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">
              Total Members Paid
            </span>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono mt-1">
              {caseStats.paidCount} / {caseStats.totalMembers}
            </div>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              {caseStats.totalMembers > 0
                ? `${Math.round((caseStats.paidCount / caseStats.totalMembers) * 100)}% contribution rate`
                : '0%'}
            </span>
          </div>

          {/* 3. Total Members Pending */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">
              Total Members Pending
            </span>
            <div className="text-xl sm:text-2xl font-bold text-amber-950 font-mono mt-1">
              {caseStats.pendingCount}
            </div>
            <span className="text-[10px] text-amber-700 block mt-0.5">
              Awaiting Saruwa contribution
            </span>
          </div>

          {/* 4. Total Pending Saruwa Amount */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">
              Total Pending Saruwa Amount
            </span>
            <div className="text-xl sm:text-2xl font-bold text-amber-950 font-mono mt-1">
              {settings.currencySymbol}
              {caseStats.totalPending.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-amber-700 block mt-0.5">
              Outstanding community funds
            </span>
          </div>
        </div>
      )}

      {/* Search & Status Filter */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Member, Receipt, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs font-medium text-stone-500">Status:</span>
          {(['All', 'Paid', 'Pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-stone-900 text-amber-400 font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Member Collection List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Saruwa Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Receipt No.</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-500">
                    No members match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isPaid = r.status === 'Paid';
                  const whatsappMsg = isPaid
                    ? formatReceiptWhatsAppMessage({
                        contributorName: r.memberName,
                        saruwaAmount: r.saruwaAmount,
                        deceasedName: currentCase.deceasedName,
                        saruwaCaseId: currentCase.id,
                        receiptNumber: r.receiptNumber || 'SR-2026',
                        paymentDate: r.paymentDate || '',
                        currencySymbol: settings.currencySymbol,
                      })
                    : '';
                  const waUrl = isPaid ? getWhatsAppUrl(r.mobileNumber, whatsappMsg) : '';

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-amber-50/20 transition-colors ${
                        isPaid ? '' : 'bg-amber-50/10'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{r.memberName}</div>
                        <div className="font-mono text-[10px] text-stone-400">{r.memberId}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-700">
                        {r.mobileNumber}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {settings.currencySymbol}
                        {r.saruwaAmount}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {r.paymentMode ? (
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-medium">
                            {r.paymentMode}
                          </span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {r.paymentDate || '-'}
                      </td>

                      <td className="py-3 px-4">
                        {r.receiptNumber ? (
                          <button
                            onClick={() => openReceiptForRecord(r)}
                            className="font-mono text-amber-800 font-bold hover:underline"
                            title="Open Saruwa Receipt"
                          >
                            {r.receiptNumber}
                          </button>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-stone-500 max-w-[120px] truncate">
                        {r.remarks || '-'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {isPaid ? (
                            <>
                              <button
                                onClick={() => openReceiptForRecord(r)}
                                className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] transition-colors"
                                title="View Saruwa Receipt"
                              >
                                Receipt
                              </button>
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                                title="Send Receipt on WhatsApp"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => revertSaruwaToPending(r.id)}
                                className="p-1 rounded text-stone-400 hover:text-amber-800 hover:bg-stone-100 transition-colors"
                                title="Revert to Pending"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleOpenRecord(r)}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors shadow-xs"
                            >
                              Record Saruwa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {recordingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Record Saruwa Collection
                </h3>
                <p className="text-xs text-stone-500">
                  Contributor: <strong className="text-stone-800">{recordingRecord.memberName}</strong>
                </p>
              </div>
              <button
                onClick={() => setRecordingRecord(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="mt-4 space-y-4">
              {/* Saruwa Amount */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Saruwa Amount (₹) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    required
                    value={paymentForm.saruwaAmount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, saruwaAmount: Number(e.target.value) })
                    }
                    className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-lg text-sm text-black font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Mode <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cash', 'UPI', 'Bank'] as PaymentMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentForm({ ...paymentForm, paymentMode: mode })}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                        paymentForm.paymentMode === mode
                          ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={paymentForm.paymentDate}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              {/* Receipt Number (optional override) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Receipt Number (Auto-assigned if empty)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave blank for auto SR-2026-..."
                  value={paymentForm.receiptNumber}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, receiptNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Remarks / Transaction ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid via GPay / Handed to Treasurer"
                  value={paymentForm.remarks}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, remarks: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRecordingRecord(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                >
                  Confirm &amp; Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
