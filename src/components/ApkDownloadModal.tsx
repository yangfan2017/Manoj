import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  ExternalLink,
  CheckCircle2,
  X,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DharmachakraIcon } from './BuddhistIcons';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallStatus('Installed successfully on your Android device!');
        }
      } catch (err) {
        console.warn('Install error', err);
      }
    } else {
      // Guide the user
      alert('To install directly on Android:\n1. Tap the 3 dots (⋮) in Chrome\n2. Tap "Install app" or "Add to Home screen"');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com/build?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 my-auto text-stone-900 relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-stone-950 flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">
                Download &amp; Install Android App
              </h3>
              <p className="text-[11px] text-stone-500">
                Gorkha Buddhist Tsokpa – Saruwa Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 text-xs">
          
          {/* Option 1: Instant Native Android Installation (Recommended) */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 uppercase tracking-wide text-[11px] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Method 1: Direct Android Install (No file needed)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Fastest
              </span>
            </div>

            <p className="text-stone-700 leading-relaxed text-[11px]">
              This application is built with Android standalone standards. You can install it directly to your Android home screen as an app icon with offline support and full screen view:
            </p>

            <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-1.5 text-[11px] text-stone-800">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-600 text-stone-950 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                <span>Open this link in <strong>Google Chrome</strong> on your Android phone.</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-600 text-stone-950 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <span>Tap the <strong>Three Dots Menu (⋮)</strong> in Chrome at top right.</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-amber-600 text-stone-950 text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
              </div>
            </div>

            <button
              onClick={handleInstallPwa}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tap to Install App on This Device</span>
            </button>

            {installStatus && (
              <p className="text-center text-emerald-700 font-bold text-[11px]">
                {installStatus}
              </p>
            )}
          </div>

          {/* Option 2: Build / Generate APK File via PWABuilder */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 uppercase tracking-wide text-[11px] flex items-center space-x-1.5">
                <Download className="w-3.5 h-3.5 text-stone-700" />
                <span>Method 2: Generate Signed Android APK File</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 text-[10px] font-semibold">
                PWABuilder
              </span>
            </div>

            <p className="text-stone-600 leading-relaxed text-[11px]">
              If you want an actual <strong>.apk</strong> file package to distribute via WhatsApp or install via file manager, you can generate a signed APK directly using Microsoft's official PWABuilder tool:
            </p>

            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>Package &amp; Download APK File</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>

          {/* Quick Share Link */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-stone-500">
              Share link with committee members:
            </span>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-600" />
                  <span>Copy App Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
