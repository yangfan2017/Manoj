import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import {
  Receipt,
  Search,
  ExternalLink,
  Printer,
  ChevronDown,
  FileSpreadsheet,
} from 'lucide-react';
import { formatReceiptWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp';
import { exportToExcel } from '../utils/export';

export const SaruwaReceiptsView: React.FC = () => {
  const { getAllReceipts, setActiveReceipt, settings, cases, members } = useSaruwa();
  const [searchQuery, setSearchQuery] = useState('');
  const [caseFilter, setCaseFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');

  const receipts = getAllReceipts();

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.saruwaContributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.deceasedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.saruwaCaseId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCase = caseFilter === 'All' || r.saruwaCaseId === caseFilter;
    const matchesMode = modeFilter === 'All' || r.paymentMode === modeFilter;

    return matchesSearch && matchesCase && matchesMode;
  });

  const totalReceiptsAmount = filteredReceipts.reduce(
    (sum, r) => sum + (Number(r.saruwaAmount) || 0),
    0
  );

  const handleExportExcel = () => {
    const exportData = filteredReceipts.map((r, idx) => ({
      'Sl. No.': idx + 1,
      'Receipt Number': r.receiptNumber,
      'Saruwa Contributor': r.saruwaContributorName,
      'Deceased Person': r.deceasedName,
      'Saruwa Case ID': r.saruwaCaseId,
      'Saruwa Amount (₹)': r.saruwaAmount,
      'Payment Mode': r.paymentMode,
      'Payment Date': r.paymentDate,
    }));
    exportToExcel(exportData, 'GBT_Saruwa_Receipts_Register', 'Receipts');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>Digital Receipts Register</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Saruwa Receipts Register
          </h2>
          <p className="text-xs text-stone-500">
            Official Saruwa contribution receipts issued to Gorkha Buddhist Tsokpa members
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          <span>Export Receipts</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-6 text-xs">
          <div>
            <span className="text-stone-500 block">Total Issued Receipts</span>
            <span className="text-base font-bold text-stone-900 font-mono">
              {filteredReceipts.length}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block">Total Amount Documented</span>
            <span className="text-base font-bold text-emerald-800 font-mono">
              {settings.currencySymbol}
              {totalReceiptsAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Receipt No., Contributor, Deceased..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Case filter */}
          <div className="relative">
            <select
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-black font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="All">All Cases</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}: {c.deceasedName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mode filter */}
          <div className="relative">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-black font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="All">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank">Bank</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Saruwa Contributor</th>
                <th className="py-3 px-4">Deceased Person</th>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Saruwa Amount</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500">
                    No Saruwa receipts found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((r) => {
                  const member = members.find((m) => m.id === r.memberId);
                  const memberPhone = member ? member.mobileNumber : '';
                  const whatsappMsg = formatReceiptWhatsAppMessage({
                    contributorName: r.saruwaContributorName,
                    saruwaAmount: r.saruwaAmount,
                    deceasedName: r.deceasedName,
                    saruwaCaseId: r.saruwaCaseId,
                    receiptNumber: r.receiptNumber,
                    paymentDate: r.paymentDate,
                    currencySymbol: settings.currencySymbol,
                  });
                  const waUrl = getWhatsAppUrl(memberPhone, whatsappMsg);

                  return (
                    <tr key={r.receiptNumber} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-950">
                        {r.receiptNumber}
                      </td>

                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {r.saruwaContributorName}
                      </td>

                      <td className="py-3 px-4 text-stone-700">
                        {r.deceasedName}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-500">
                        {r.saruwaCaseId}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                        {settings.currencySymbol}
                        {r.saruwaAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium text-[11px]">
                          {r.paymentMode}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {r.paymentDate}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => setActiveReceipt(r)}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
                          >
                            View Receipt
                          </button>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                            title="Send on WhatsApp"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
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
