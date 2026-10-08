import React from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import {
  Users,
  FolderHeart,
  HandCoins,
  Clock,
  Banknote,
  Smartphone,
  Landmark,
  PlusCircle,
  Receipt,
  FileSpreadsheet,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { DharmachakraIcon } from './BuddhistIcons';
import { getWhatsAppUrl, formatReceiptWhatsAppMessage } from '../utils/whatsapp';

export const DashboardView: React.FC = () => {
  const {
    settings,
    totalMembersCount,
    activeMembersCount,
    activeCasesCount,
    totalSaruwaCollected,
    totalPendingSaruwa,
    cashSaruwa,
    upiSaruwa,
    bankSaruwa,
    cases,
    records,
    setActiveTab,
    setSelectedCaseId,
    openReceiptForRecord,
  } = useSaruwa();

  const activeCases = cases.filter((c) => c.status === 'Active');
  const recentPaidRecords = records
    .filter((r) => r.status === 'Paid')
    .slice(0, 5);

  const pendingCount = records.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-stone-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
          <DharmachakraIcon className="w-56 h-56 text-amber-400" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/30">
            <DharmachakraIcon className="w-3.5 h-3.5" />
            <span>Gorkha Buddhist Tsokpa Committee</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
            Saruwa Management Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
            Solemn, transparent record-keeping of community Saruwa contributions for bereaved member families.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('new-saruwa')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Saruwa Case</span>
            </button>
            <button
              onClick={() => setActiveTab('saruwa-collection')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs transition-colors border border-stone-700"
            >
              <HandCoins className="w-4 h-4 text-amber-400" />
              <span>Record Saruwa Collection</span>
            </button>
            <button
              onClick={() => {
                const btn = document.querySelector('header button[title*="APK"]') as HTMLButtonElement;
                btn?.click();
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition-colors border border-amber-500/40"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Download APK / Install App</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Required Dashboard Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Saruwa Overview &amp; Accounts
          </h3>
          <span className="text-[11px] text-stone-500">
            Live calculations
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* 1. Total Members */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">Total Members</span>
              <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-amber-100 text-stone-700 group-hover:text-amber-800 transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-900 font-mono">
              {totalMembersCount}
            </div>
            <div className="mt-1 text-[11px] text-stone-500">
              {activeMembersCount} Active · {totalMembersCount - activeMembersCount} Inactive
            </div>
          </div>

          {/* 2. Active Saruwa Cases */}
          <div
            onClick={() => setActiveTab('saruwa-cases')}
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">Active Saruwa Cases</span>
              <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-amber-100 text-stone-700 group-hover:text-amber-800 transition-colors">
                <FolderHeart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-900 font-mono">
              {activeCasesCount}
            </div>
            <div className="mt-1 text-[11px] text-stone-500">
              {cases.length} Total cases recorded
            </div>
          </div>

          {/* 3. Total Saruwa Collected */}
          <div
            onClick={() => setActiveTab('saruwa-collection')}
            className="p-4 bg-white rounded-xl border border-emerald-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-800">Total Saruwa Collected</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <HandCoins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-950 font-mono">
              {settings.currencySymbol}
              {totalSaruwaCollected.toLocaleString('en-IN')}
            </div>
            <div className="mt-1 text-[11px] text-emerald-700 font-medium">
              Verified community assistance
            </div>
          </div>

          {/* 4. Total Pending Saruwa */}
          <div
            onClick={() => setActiveTab('pending-saruwa')}
            className="p-4 bg-white rounded-xl border border-amber-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-900">Total Pending Saruwa</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-950 font-mono">
              {settings.currencySymbol}
              {totalPendingSaruwa.toLocaleString('en-IN')}
            </div>
            <div className="mt-1 text-[11px] text-amber-800">
              {pendingCount} Member contributions pending
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modes Breakdown: Cash Saruwa, UPI Saruwa, Bank Saruwa */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Saruwa Collection By Mode
          </h3>
          <span className="text-[11px] text-stone-500">
            Total Breakdown: {settings.currencySymbol}{totalSaruwaCollected.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Cash Saruwa */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-700">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Cash Saruwa</span>
              </div>
              <div className="mt-1 text-xl font-bold text-stone-900 font-mono">
                {settings.currencySymbol}
                {cashSaruwa.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-xs text-stone-500 font-medium">
              {totalSaruwaCollected > 0 ? `${Math.round((cashSaruwa / totalSaruwaCollected) * 100)}%` : '0%'}
            </div>
          </div>

          {/* UPI Saruwa */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-700">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>UPI Saruwa</span>
              </div>
              <div className="mt-1 text-xl font-bold text-stone-900 font-mono">
                {settings.currencySymbol}
                {upiSaruwa.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-xs text-stone-500 font-medium">
              {totalSaruwaCollected > 0 ? `${Math.round((upiSaruwa / totalSaruwaCollected) * 100)}%` : '0%'}
            </div>
          </div>

          {/* Bank Saruwa */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-700">
                <Landmark className="w-4 h-4 text-purple-600" />
                <span>Bank Saruwa</span>
              </div>
              <div className="mt-1 text-xl font-bold text-stone-900 font-mono">
                {settings.currencySymbol}
                {bankSaruwa.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-xs text-stone-500 font-medium">
              {totalSaruwaCollected > 0 ? `${Math.round((bankSaruwa / totalSaruwaCollected) * 100)}%` : '0%'}
            </div>
          </div>
        </div>
      </div>

      {/* Active Cases Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Ongoing Saruwa Cases
            </h3>
            <p className="text-xs text-stone-500">
              Community assistance collection currently active
            </p>
          </div>
          <button
            onClick={() => setActiveTab('saruwa-cases')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>View All Cases</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeCases.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-xs">
            No active Saruwa cases at present.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCases.map((c) => {
              const caseRecords = records.filter((r) => r.caseId === c.id);
              const paidRecords = caseRecords.filter((r) => r.status === 'Paid');
              const collected = paidRecords.reduce((sum, r) => sum + r.saruwaAmount, 0);
              const percent = caseRecords.length > 0 ? Math.round((paidRecords.length / caseRecords.length) * 100) : 0;

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-stone-200 bg-amber-50/20 hover:border-amber-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-mono font-medium text-amber-900">{c.id}</span>
                      <span>Death Date: {c.deathDate}</span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900">
                      {c.deceasedName}
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Family: {c.familyMemberName}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Contact: {c.contactPerson} ({c.contactNumber})
                    </p>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                        <span>
                          Paid: {paidRecords.length} / {caseRecords.length} members ({percent}%)
                        </span>
                        <span className="font-mono font-bold text-emerald-800">
                          {settings.currencySymbol}{collected.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setSelectedCaseId(c.id);
                        setActiveTab('saruwa-collection');
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                    >
                      Collect Saruwa
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCaseId(c.id);
                        setActiveTab('reports');
                      }}
                      className="text-xs font-medium text-stone-600 hover:text-stone-900"
                    >
                      Case Report →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Saruwa Collections Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Recent Saruwa Collections
            </h3>
            <p className="text-xs text-stone-500">
              Latest contributions recorded with receipts
            </p>
          </div>
          <button
            onClick={() => setActiveTab('saruwa-receipts')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>All Receipts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Receipt No.</th>
                <th className="py-2.5 px-3">Saruwa Contributor</th>
                <th className="py-2.5 px-3">Case</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Receipt &amp; WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {recentPaidRecords.map((r) => {
                const targetCase = cases.find((c) => c.id === r.caseId);
                const deceasedName = targetCase ? targetCase.deceasedName : 'Bereaved Family';
                const whatsappMsg = formatReceiptWhatsAppMessage({
                  contributorName: r.memberName,
                  saruwaAmount: r.saruwaAmount,
                  deceasedName,
                  saruwaCaseId: r.caseId,
                  receiptNumber: r.receiptNumber || 'SR-2026',
                  paymentDate: r.paymentDate || '',
                  currencySymbol: settings.currencySymbol,
                });
                const waUrl = getWhatsAppUrl(r.mobileNumber, whatsappMsg);

                return (
                  <tr key={r.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-stone-900">
                      {r.receiptNumber}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">
                      {r.memberName}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 max-w-xs truncate">
                      {deceasedName}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                      {settings.currencySymbol}
                      {r.saruwaAmount}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium text-[11px]">
                        {r.paymentMode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">
                      {r.paymentDate}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => openReceiptForRecord(r)}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-[11px] transition-colors"
                          title="View Digital Saruwa Receipt"
                        >
                          Receipt
                        </button>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                          title="Share on WhatsApp"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
