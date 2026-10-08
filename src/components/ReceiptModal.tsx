import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import { DharmachakraIcon } from './BuddhistIcons';
import {
  Printer,
  Share2,
  Download,
  X,
  Check,
  ExternalLink,
} from 'lucide-react';
import { formatReceiptWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, settings, members } = useSaruwa();
  const [copied, setCopied] = useState(false);

  if (!activeReceipt) return null;

  // Find member contact if available
  const member = members.find((m) => m.id === activeReceipt.memberId);
  const memberPhone = member ? member.mobileNumber : '';

  const whatsappMessage = formatReceiptWhatsAppMessage({
    contributorName: activeReceipt.saruwaContributorName,
    saruwaAmount: activeReceipt.saruwaAmount,
    deceasedName: activeReceipt.deceasedName,
    saruwaCaseId: activeReceipt.saruwaCaseId,
    receiptNumber: activeReceipt.receiptNumber,
    paymentDate: activeReceipt.paymentDate,
    currencySymbol: settings.currencySymbol,
  });

  const whatsappUrl = getWhatsAppUrl(memberPhone, whatsappMessage);

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePdf = () => {
    // Standard and reliable cross-platform PDF generation trigger
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Saruwa Receipt ${activeReceipt.receiptNumber}`,
          text: whatsappMessage,
        });
      } catch {
        // Fallback to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto print-container">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-900 text-white no-print">
          <div className="flex items-center space-x-2">
            <DharmachakraIcon className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold tracking-wide">Digital Saruwa Receipt</span>
          </div>
          <button
            onClick={() => setActiveReceipt(null)}
            className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Body */}
        <div className="p-6 sm:p-8 bg-amber-50/30 text-stone-900 font-sans border-b border-stone-200 relative">
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
            <DharmachakraIcon className="w-72 h-72 text-stone-900" />
          </div>

          {/* Receipt Header */}
          <div className="text-center pb-4 border-b-2 border-stone-800/80 relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-800 mb-2 border border-amber-300">
              <DharmachakraIcon className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-stone-900 font-serif">
              {settings.orgName}
            </h1>
            <p className="text-xs text-stone-600 font-medium tracking-wide uppercase mt-0.5">
              {settings.orgSubtitle}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Regd. No: {settings.registrationNumber}
            </p>
            <p className="text-[11px] text-stone-500">
              {settings.address}
            </p>

            <div className="mt-3 inline-block bg-stone-900 text-amber-400 font-bold px-4 py-1 rounded-sm text-xs tracking-widest uppercase">
              SARUWA RECEIPT
            </div>
          </div>

          {/* Receipt Info Grid */}
          <div className="py-4 space-y-3 relative text-sm">
            <div className="flex justify-between items-center py-1 border-b border-dashed border-stone-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                Receipt Number:
              </span>
              <span className="font-mono font-bold text-stone-900 text-sm bg-stone-100 px-2 py-0.5 rounded">
                {activeReceipt.receiptNumber}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-dashed border-stone-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                Saruwa Case ID:
              </span>
              <span className="font-mono font-medium text-stone-900 text-sm">
                {activeReceipt.saruwaCaseId}
              </span>
            </div>

            <div className="flex justify-between items-start py-1 border-b border-dashed border-stone-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 pt-0.5">
                Saruwa Contributor Name:
              </span>
              <span className="font-bold text-stone-900 text-right text-base">
                {activeReceipt.saruwaContributorName}
              </span>
            </div>

            <div className="flex justify-between items-start py-1 border-b border-dashed border-stone-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 pt-0.5">
                Deceased Person Name:
              </span>
              <span className="font-semibold text-stone-800 text-right">
                {activeReceipt.deceasedName}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-dashed border-stone-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                Payment Date:
              </span>
              <span className="text-stone-900 font-medium">
                {activeReceipt.paymentDate}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-dashed border-stone-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                Payment Mode:
              </span>
              <span className="font-semibold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded text-xs uppercase tracking-wider">
                {activeReceipt.paymentMode}
              </span>
            </div>

            {/* Saruwa Amount Box */}
            <div className="mt-4 p-3 bg-amber-500/10 border-2 border-amber-600/30 rounded-lg flex justify-between items-center">
              <div>
                <span className="text-xs uppercase font-bold text-amber-950 tracking-wider block">
                  Saruwa Amount
                </span>
                <span className="text-[11px] text-amber-800">
                  Community death assistance contribution
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-950 font-mono">
                {settings.currencySymbol}
                {activeReceipt.saruwaAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Committee Authorization Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-4 text-center text-xs text-stone-600 relative">
            <div>
              <div className="h-8 border-b border-stone-400 mx-auto w-28"></div>
              <p className="mt-1 font-semibold text-stone-800">{settings.treasurerName}</p>
              <p className="text-[10px] text-stone-500">Treasurer</p>
            </div>
            <div>
              <div className="h-8 border-b border-stone-400 mx-auto w-28"></div>
              <p className="mt-1 font-semibold text-stone-800">{settings.presidentName}</p>
              <p className="text-[10px] text-stone-500">President / Secretary</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 text-center text-[10px] text-stone-500 italic">
            This is an authentic digital receipt generated by Gorkha Buddhist Tsokpa Committee.
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="p-4 bg-white space-y-2.5 no-print">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            
            {/* 1. Generate PDF */}
            <button
              onClick={handleGeneratePdf}
              className="flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium text-xs transition-colors"
              title="Save as PDF via browser print dialog"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Generate PDF</span>
            </button>

            {/* 2. Print */}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium text-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>Print</span>
            </button>

            {/* 3. Share Receipt */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium text-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-stone-600" />
                  <span>Share Receipt</span>
                </>
              )}
            </button>

            {/* 4. Send via WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs transition-colors shadow-xs"
            >
              <span className="font-bold">WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-[11px] text-center text-stone-500">
            Send WhatsApp message directly to {activeReceipt.saruwaContributorName} ({memberPhone || 'Member'})
          </p>
        </div>
      </div>
    </div>
  );
};
