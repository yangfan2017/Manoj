import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import {
  History,
  Search,
  User,
  Phone,
  Receipt,
  FileSpreadsheet,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { exportToExcel } from '../utils/export';

export const SaruwaHistoryView: React.FC = () => {
  const { members, getMemberHistory, settings, openReceiptForRecord } = useSaruwa();
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];
  const history = selectedMember ? getMemberHistory(selectedMember.id) : null;

  const filteredMembersList = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      m.mobileNumber.includes(searchMemberQuery)
  );

  const handleExportHistory = () => {
    if (!selectedMember || !history) return;
    const exportData = history.records.map((r, idx) => ({
      'Sl. No.': idx + 1,
      'Payment Date': r.paymentDate || 'Pending',
      'Saruwa Case ID': r.caseId,
      'Deceased Person': r.deceasedName,
      'Saruwa Amount (₹)': r.saruwaAmount,
      'Payment Status': r.status,
      'Payment Mode': r.paymentMode || 'N/A',
      'Receipt Number': r.receiptNumber || 'N/A',
      'Remarks': r.remarks || '',
    }));
    exportToExcel(
      exportData,
      `Saruwa_History_${selectedMember.id}_${selectedMember.fullName.replace(/[^a-zA-Z0-9]/g, '_')}`,
      'Saruwa History'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Member Contribution Records</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Member Saruwa History
          </h2>
          <p className="text-xs text-stone-500">
            View lifetime Saruwa contributions and receipts for any Tsokpa member
          </p>
        </div>

        {selectedMember && (
          <button
            onClick={handleExportHistory}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Member History</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Member Selector & Search */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Select Tsokpa Member
          </h3>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Find member..."
              value={searchMemberQuery}
              onChange={(e) => setSearchMemberQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-1 pr-1">
            {filteredMembersList.map((m) => {
              const isSelected = m.id === selectedMember?.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberId(m.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-xs font-semibold'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="block font-medium truncate">{m.fullName}</span>
                    <span
                      className={`text-[10px] block ${
                        isSelected ? 'text-amber-400 font-mono' : 'text-stone-500 font-mono'
                      }`}
                    >
                      {m.id} · {m.mobileNumber}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded shrink-0 ${
                      m.status === 'Active'
                        ? isSelected
                          ? 'bg-emerald-800 text-emerald-200'
                          : 'bg-emerald-100 text-emerald-800'
                        : isSelected
                        ? 'bg-stone-800 text-stone-400'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {m.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Member's Profile & Complete History */}
        <div className="lg:col-span-2 space-y-4">
          {selectedMember && history ? (
            <>
              {/* Member Summary Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {selectedMember.id}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        {selectedMember.status} Member
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mt-1">
                      {selectedMember.fullName}
                    </h3>
                    <p className="text-xs text-stone-600">
                      Father/Husband: {selectedMember.fatherHusbandName} · Address: {selectedMember.address}
                    </p>
                  </div>

                  {/* Total Saruwa Contribution Box */}
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-right sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-amber-950 tracking-wider block">
                      Total Saruwa Contribution
                    </span>
                    <div className="text-2xl font-black text-amber-950 font-mono mt-0.5">
                      {settings.currencySymbol}
                      {history.totalContributed.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-amber-800 block">
                      {history.paidCount} Cases Contributed · {history.pendingCount} Pending
                    </span>
                  </div>
                </div>

                {/* History Table */}
                <div className="mt-4 overflow-x-auto">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                    Complete Saruwa History
                  </h4>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Saruwa Case</th>
                        <th className="py-2.5 px-3">Deceased Person</th>
                        <th className="py-2.5 px-3">Saruwa Amount</th>
                        <th className="py-2.5 px-3">Mode</th>
                        <th className="py-2.5 px-3">Receipt Number</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {history.records.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-stone-500">
                            No Saruwa records found for this member.
                          </td>
                        </tr>
                      ) : (
                        history.records.map((rec) => (
                          <tr key={rec.id} className="hover:bg-amber-50/20 transition-colors">
                            <td className="py-2.5 px-3 text-stone-600 font-medium">
                              {rec.paymentDate || 'Pending'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-stone-800">
                              {rec.caseId}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-stone-900">
                              {rec.deceasedName}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                              {settings.currencySymbol}
                              {rec.saruwaAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3">
                              {rec.paymentMode ? (
                                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-medium">
                                  {rec.paymentMode}
                                </span>
                              ) : (
                                <span className="text-amber-800 font-semibold text-[11px]">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {rec.receiptNumber ? (
                                <button
                                  onClick={() => openReceiptForRecord(rec)}
                                  className="font-mono text-amber-800 font-bold hover:underline"
                                  title="View Digital Receipt"
                                >
                                  {rec.receiptNumber}
                                </button>
                              ) : (
                                <span className="text-stone-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
              Select a member to view their Saruwa history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
