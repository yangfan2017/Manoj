import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  ChevronDown,
  Building2,
  Calendar,
  Banknote,
  Smartphone,
  Landmark,
} from 'lucide-react';
import { exportCaseReportToExcel } from '../utils/export';
import { DharmachakraIcon } from './BuddhistIcons';

export const ReportsView: React.FC = () => {
  const { cases, records, getCaseStats, selectedCaseId, setSelectedCaseId, settings } = useSaruwa();
  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const caseStats = currentCase ? getCaseStats(currentCase.id) : null;
  const caseRecords = records.filter((r) => r.caseId === currentCase?.id);

  const handleExportExcel = () => {
    if (!currentCase || !caseStats) return;
    exportCaseReportToExcel(currentCase, caseRecords, caseStats);
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (!currentCase || !caseStats) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
        No Saruwa cases available for reporting.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Audit &amp; Committee Financial Reports</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Saruwa Case Report
          </h2>
          <p className="text-xs text-stone-500">
            Comprehensive financial breakdown and member contribution list for official audit
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Case selector dropdown */}
          <div className="relative">
            <select
              value={currentCase.id}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-stone-300 rounded-xl text-xs text-black font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}: {c.deceasedName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Printable Report Document Body */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs print-container">
        
        {/* Document Letterhead */}
        <div className="text-center pb-6 border-b-2 border-stone-800">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-900 mb-2 border border-amber-300">
            <DharmachakraIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-stone-900 font-serif">
            {settings.orgName}
          </h1>
          <p className="text-xs text-stone-600 font-semibold uppercase tracking-wider mt-0.5">
            {settings.orgSubtitle}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Regd: {settings.registrationNumber} · {settings.address}
          </p>
          <div className="mt-3 inline-block bg-stone-900 text-amber-400 font-bold px-4 py-1 rounded text-xs uppercase tracking-widest">
            OFFICIAL SARUWA CASE REPORT
          </div>
        </div>

        {/* Case Metadata Grid */}
        <div className="py-4 border-b border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-stone-500 uppercase font-semibold text-[10px] block">
              Saruwa Case ID
            </span>
            <span className="font-mono font-bold text-stone-900 text-sm">
              {currentCase.id}
            </span>
          </div>

          <div>
            <span className="text-stone-500 uppercase font-semibold text-[10px] block">
              Deceased Person Name
            </span>
            <span className="font-bold text-stone-900 text-base">
              {currentCase.deceasedName}
            </span>
          </div>

          <div>
            <span className="text-stone-500 uppercase font-semibold text-[10px] block">
              Bereaved Family / Member
            </span>
            <span className="font-semibold text-stone-800">
              {currentCase.familyMemberName}
            </span>
          </div>

          <div>
            <span className="text-stone-500 uppercase font-semibold text-[10px] block">
              Date of Death
            </span>
            <span className="text-stone-900 font-medium">
              {currentCase.deathDate}
            </span>
          </div>

          <div>
            <span className="text-stone-500 uppercase font-semibold text-[10px] block">
              Mourning Address
            </span>
            <span className="text-stone-800">
              {currentCase.address}
            </span>
          </div>

          <div>
            <span className="text-stone-500 uppercase font-semibold text-[10px] block">
              Collection Period
            </span>
            <span className="text-stone-800 font-medium">
              {currentCase.collectionStartDate} to {currentCase.collectionEndDate}
            </span>
          </div>
        </div>

        {/* 10 Required Report Metrics Grid */}
        <div className="py-5 border-b border-stone-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
            Financial &amp; Member Participation Summary
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* Total Members */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-semibold text-stone-500 uppercase block">
                Total Members
              </span>
              <span className="text-lg font-bold text-stone-900 font-mono block mt-1">
                {caseStats.totalMembers}
              </span>
            </div>

            {/* Members Who Paid Saruwa */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-semibold text-emerald-800 uppercase block">
                Members Who Paid Saruwa
              </span>
              <span className="text-lg font-bold text-emerald-950 font-mono block mt-1">
                {caseStats.paidCount}
              </span>
            </div>

            {/* Members With Pending Saruwa */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] font-semibold text-amber-900 uppercase block">
                Members With Pending Saruwa
              </span>
              <span className="text-lg font-bold text-amber-950 font-mono block mt-1">
                {caseStats.pendingCount}
              </span>
            </div>

            {/* Total Saruwa Collected */}
            <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-300">
              <span className="text-[10px] font-bold text-emerald-900 uppercase block">
                Total Saruwa Collected
              </span>
              <span className="text-lg font-black text-emerald-950 font-mono block mt-1">
                {settings.currencySymbol}{caseStats.totalCollected.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Total Pending Saruwa */}
            <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-300">
              <span className="text-[10px] font-bold text-amber-950 uppercase block">
                Total Pending Saruwa
              </span>
              <span className="text-lg font-black text-amber-950 font-mono block mt-1">
                {settings.currencySymbol}{caseStats.totalPending.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Cash Saruwa */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-semibold text-stone-600 uppercase block">
                Cash Saruwa
              </span>
              <span className="text-base font-bold text-stone-900 font-mono block mt-1">
                {settings.currencySymbol}{caseStats.cashAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* UPI Saruwa */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-semibold text-stone-600 uppercase block">
                UPI Saruwa
              </span>
              <span className="text-base font-bold text-stone-900 font-mono block mt-1">
                {settings.currencySymbol}{caseStats.upiAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Bank Saruwa */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-semibold text-stone-600 uppercase block">
                Bank Saruwa
              </span>
              <span className="text-base font-bold text-stone-900 font-mono block mt-1">
                {settings.currencySymbol}{caseStats.bankAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Member Records Table in Report */}
        <div className="pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
            Itemized Member Collection Roster
          </h3>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Sl.</th>
                  <th className="py-2.5 px-3">Member ID</th>
                  <th className="py-2.5 px-3">Member Name</th>
                  <th className="py-2.5 px-3">Mobile</th>
                  <th className="py-2.5 px-3">Saruwa Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Payment Date</th>
                  <th className="py-2.5 px-3">Receipt No.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {caseRecords.map((r, idx) => (
                  <tr key={r.id}>
                    <td className="py-2 px-3 text-stone-500 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono font-medium text-stone-700">{r.memberId}</td>
                    <td className="py-2 px-3 font-semibold text-stone-900">{r.memberName}</td>
                    <td className="py-2 px-3 font-mono text-stone-600">{r.mobileNumber}</td>
                    <td className="py-2 px-3 font-mono font-bold text-stone-900">
                      {settings.currencySymbol}{r.saruwaAmount}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          r.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-stone-600">{r.paymentMode || '-'}</td>
                    <td className="py-2 px-3 text-stone-600">{r.paymentDate || '-'}</td>
                    <td className="py-2 px-3 font-mono text-stone-700">{r.receiptNumber || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Committee Signature Block */}
        <div className="pt-10 grid grid-cols-3 gap-6 text-center text-xs text-stone-700">
          <div>
            <div className="h-10 border-b border-stone-400 mx-auto w-36"></div>
            <p className="mt-1 font-bold text-stone-900">{settings.treasurerName}</p>
            <p className="text-[10px] text-stone-500">Treasurer / Cashier</p>
          </div>
          <div>
            <div className="h-10 border-b border-stone-400 mx-auto w-36"></div>
            <p className="mt-1 font-bold text-stone-900">{settings.secretaryName}</p>
            <p className="text-[10px] text-stone-500">General Secretary</p>
          </div>
          <div>
            <div className="h-10 border-b border-stone-400 mx-auto w-36"></div>
            <p className="mt-1 font-bold text-stone-900">{settings.presidentName}</p>
            <p className="text-[10px] text-stone-500">President, Tsokpa</p>
          </div>
        </div>
      </div>
    </div>
  );
};
