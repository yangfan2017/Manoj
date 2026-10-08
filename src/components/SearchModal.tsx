import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import {
  Search,
  X,
  Users,
  FolderHeart,
  Receipt,
  HandCoins,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { PaymentMode, PaymentStatus } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const {
    members,
    cases,
    records,
    setActiveTab,
    setSelectedCaseId,
    openReceiptForRecord,
    settings,
  } = useSaruwa();

  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search in Members
  const matchedMembers = q
    ? members.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.mobileNumber.includes(q) ||
          m.address.toLowerCase().includes(q)
      )
    : [];

  // Search in Cases
  const matchedCases = q
    ? cases.filter(
        (c) =>
          c.deceasedName.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.familyMemberName.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      )
    : [];

  // Search in Collection Records
  const matchedRecords = records.filter((r) => {
    const targetCase = cases.find((c) => c.id === r.caseId);
    const deceased = targetCase ? targetCase.deceasedName.toLowerCase() : '';

    const matchesQuery =
      !q ||
      r.memberName.toLowerCase().includes(q) ||
      r.memberId.toLowerCase().includes(q) ||
      r.mobileNumber.includes(q) ||
      r.caseId.toLowerCase().includes(q) ||
      deceased.includes(q) ||
      (r.receiptNumber && r.receiptNumber.toLowerCase().includes(q)) ||
      (r.paymentDate && r.paymentDate.includes(q));

    const matchesMode = filterMode === 'All' || r.paymentMode === filterMode;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

    return matchesQuery && matchesMode && matchesStatus;
  }).slice(0, 15); // limit to top 15 results for snappiness

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 mt-6 sm:mt-12 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center space-x-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search Member, Mobile, Case ID, Deceased, Date, Receipt..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder:text-stone-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="px-4 py-2 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-semibold text-stone-600">Filters:</span>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-1 bg-white border border-stone-300 rounded text-black text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-2 py-1 bg-white border border-stone-300 rounded text-black text-xs"
            >
              <option value="All">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {/* Matched Cases */}
          {matchedCases.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 mb-2">
                <FolderHeart className="w-4 h-4 text-amber-700" />
                <span>Saruwa Cases ({matchedCases.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      setActiveTab('saruwa-collection');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50/50 cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-900">{c.id}</span>
                      <span className="font-bold text-stone-900 ml-2">{c.deceasedName}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Family: {c.familyMemberName} · Death: {c.deathDate}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Members */}
          {matchedMembers.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 mb-2">
                <Users className="w-4 h-4 text-amber-700" />
                <span>Members ({matchedMembers.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedMembers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setActiveTab('members');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-stone-50 cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-stone-700">{m.id}</span>
                      <span className="font-bold text-stone-900 ml-2">{m.fullName}</span>
                      <span className="text-stone-500 font-mono ml-2">({m.mobileNumber})</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">{m.address}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Saruwa Collection Records */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 mb-2">
              <HandCoins className="w-4 h-4 text-amber-700" />
              <span>Saruwa Records ({matchedRecords.length})</span>
            </div>

            {matchedRecords.length === 0 ? (
              <div className="py-6 text-center text-stone-400 text-xs">
                No Saruwa records matching your search or filters.
              </div>
            ) : (
              <div className="space-y-1.5">
                {matchedRecords.map((r) => {
                  const targetCase = cases.find((c) => c.id === r.caseId);
                  const deceasedName = targetCase ? targetCase.deceasedName : '';

                  return (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-amber-50/20 transition-all flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-stone-900">{r.memberName}</span>
                          <span className="font-mono text-[10px] text-stone-500">{r.memberId}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                              r.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          For: {deceasedName} ({r.caseId})
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {r.paymentDate ? `Paid on ${r.paymentDate} via ${r.paymentMode}` : 'Pending collection'}
                          {r.receiptNumber ? ` · Receipt: ${r.receiptNumber}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 text-right">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {settings.currencySymbol}{r.saruwaAmount}
                        </span>
                        {r.status === 'Paid' ? (
                          <button
                            onClick={() => {
                              openReceiptForRecord(r);
                              onClose();
                            }}
                            className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold"
                          >
                            Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCaseId(r.caseId);
                              setActiveTab('saruwa-collection');
                              onClose();
                            }}
                            className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 text-[11px] font-bold"
                          >
                            Collect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
