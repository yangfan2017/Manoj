import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import {
  Clock,
  Search,
  ExternalLink,
  Copy,
  Check,
  Send,
  ChevronDown,
  HandCoins,
  FileSpreadsheet,
} from 'lucide-react';
import { formatPendingReminderWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp';
import { exportToExcel } from '../utils/export';

export const PendingSaruwaView: React.FC = () => {
  const {
    records,
    cases,
    settings,
    recordSaruwaPayment,
    setSelectedCaseId,
    setActiveTab,
  } = useSaruwa();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter only pending records
  const pendingRecords = records.filter((r) => r.status === 'Pending');

  const filteredPending = pendingRecords.filter((r) => {
    const matchesSearch =
      r.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.mobileNumber.includes(searchQuery);

    const matchesCase =
      selectedCaseFilter === 'All' || r.caseId === selectedCaseFilter;

    return matchesSearch && matchesCase;
  });

  const totalPendingAmount = filteredPending.reduce(
    (sum, r) => sum + (Number(r.saruwaAmount) || 0),
    0
  );

  const handleCopyReminder = (memberName: string, deceasedName: string, id: string) => {
    const message = formatPendingReminderWhatsAppMessage({
      memberName,
      deceasedName,
    });
    navigator.clipboard.writeText(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportPending = () => {
    const exportData = filteredPending.map((r, idx) => {
      const matchedCase = cases.find((c) => c.id === r.caseId);
      return {
        'Sl. No.': idx + 1,
        'Member ID': r.memberId,
        'Member Name': r.memberName,
        'Mobile Number': r.mobileNumber,
        'Saruwa Case': r.caseId,
        'Deceased Person': matchedCase ? matchedCase.deceasedName : 'Bereaved Family',
        'Pending Saruwa Amount (₹)': r.saruwaAmount,
        'Status': 'Pending',
      };
    });
    exportToExcel(exportData, 'GBT_Pending_Saruwa_List', 'Pending Saruwa');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Community Pending Contributions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Pending Saruwa Follow-up
          </h2>
          <p className="text-xs text-stone-500">
            Send polite reminders to Tsokpa members regarding pending Saruwa contributions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPending}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Pending Excel</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <span className="text-xs font-semibold text-amber-900">Total Pending Members</span>
          <div className="text-2xl font-bold text-amber-950 font-mono mt-1">
            {filteredPending.length}
          </div>
          <span className="text-[11px] text-amber-800 mt-0.5 block">
            Awaiting community assistance
          </span>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <span className="text-xs font-semibold text-amber-900">Total Pending Saruwa Amount</span>
          <div className="text-2xl font-bold text-amber-950 font-mono mt-1">
            {settings.currencySymbol}
            {totalPendingAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-800 mt-0.5 block">
            Expected for bereaved families
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col justify-between">
          <span className="text-xs font-medium text-stone-500">Reminder Protocol</span>
          <p className="text-xs text-stone-600 mt-1 leading-snug">
            Reminders maintain Tsokpa tradition with respectful, gentle language for deceased members' families.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Member Name, ID, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs font-medium text-stone-500">Saruwa Case:</span>
          <div className="relative">
            <select
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-black font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="All">All Active &amp; Past Cases</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}: {c.deceasedName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Pending Saruwa Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Saruwa Amount</th>
                <th className="py-3 px-4">Saruwa Case</th>
                <th className="py-3 px-4">Pending Status</th>
                <th className="py-3 px-4 text-right">Send WhatsApp Reminder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPending.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No pending Saruwa records matching your selection. All members are paid up!
                  </td>
                </tr>
              ) : (
                filteredPending.map((r) => {
                  const targetCase = cases.find((c) => c.id === r.caseId);
                  const deceasedName = targetCase ? targetCase.deceasedName : 'Bereaved Family';
                  const reminderMessage = formatPendingReminderWhatsAppMessage({
                    memberName: r.memberName,
                    deceasedName,
                  });
                  const waUrl = getWhatsAppUrl(r.mobileNumber, reminderMessage);

                  return (
                    <tr key={r.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{r.memberName}</div>
                        <div className="font-mono text-[10px] text-stone-400">{r.memberId}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-700">
                        {r.mobileNumber}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-amber-950">
                        {settings.currencySymbol}
                        {r.saruwaAmount}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-800">{deceasedName}</div>
                        <div className="font-mono text-[10px] text-stone-400">{r.caseId}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Pending
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-2">
                          {/* Copy Reminder Text */}
                          <button
                            onClick={() => handleCopyReminder(r.memberName, deceasedName, r.id)}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
                            title="Copy Gentle Reminder Text"
                          >
                            {copiedId === r.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Direct WhatsApp Reminder Button */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors shadow-xs"
                          >
                            <span>WhatsApp Reminder</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Collect Saruwa Quick Shortcut */}
                          <button
                            onClick={() => {
                              setSelectedCaseId(r.caseId);
                              setActiveTab('saruwa-collection');
                            }}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-stone-900 transition-colors"
                            title="Collect Now"
                          >
                            <HandCoins className="w-4 h-4 text-amber-700" />
                          </button>
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
    </div>
  );
};
