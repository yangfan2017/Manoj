/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SaruwaProvider, useSaruwa } from './context/SaruwaContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ReceiptModal } from './components/ReceiptModal';
import { SearchModal } from './components/SearchModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';

// Views
import { DashboardView } from './components/DashboardView';
import { MembersView } from './components/MembersView';
import { NewSaruwaView } from './components/NewSaruwaView';
import { SaruwaCasesView } from './components/SaruwaCasesView';
import { SaruwaCollectionView } from './components/SaruwaCollectionView';
import { PendingSaruwaView } from './components/PendingSaruwaView';
import { SaruwaReceiptsView } from './components/SaruwaReceiptsView';
import { SaruwaHistoryView } from './components/SaruwaHistoryView';
import { ReportsView } from './components/ReportsView';
import { BackupRestoreView } from './components/BackupRestoreView';
import { SettingsView } from './components/SettingsView';
import { DharmachakraIcon, EndlessKnotIcon } from './components/BuddhistIcons';

const MainAppContent: React.FC = () => {
  const { activeTab, settings } = useSaruwa();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'members':
        return <MembersView />;
      case 'new-saruwa':
        return <NewSaruwaView />;
      case 'saruwa-cases':
        return <SaruwaCasesView />;
      case 'saruwa-collection':
        return <SaruwaCollectionView />;
      case 'pending-saruwa':
        return <PendingSaruwaView />;
      case 'saruwa-receipts':
        return <SaruwaReceiptsView />;
      case 'saruwa-history':
        return <SaruwaHistoryView />;
      case 'reports':
        return <ReportsView />;
      case 'backup-restore':
        return <BackupRestoreView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col selection:bg-amber-200 selection:text-stone-900">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Slide Navigation Drawer & Mobile Bottom Nav */}
      <Navigation
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 py-6 px-4 text-center text-xs border-t border-stone-800 no-print">
        <div className="max-w-md mx-auto flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 text-amber-500">
            <EndlessKnotIcon className="w-5 h-5 text-amber-400" />
            <span className="font-semibold tracking-wider uppercase text-[11px] text-amber-300">
              {settings.orgName}
            </span>
            <EndlessKnotIcon className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            Community Saruwa Management · Dedicated to solemn mutual support, solidarity, and transparent member care.
          </p>
          <p className="text-[10px] text-stone-400">
            Office: {settings.address} · Phone: {settings.phone}
          </p>
          <div className="pt-2.5 mt-1 border-t border-stone-800 w-full text-center">
            <p className="text-[11px] text-amber-400 font-medium tracking-wide">
              Software Developed by <span className="font-bold text-white tracking-wider">Manoj Kumar Tamang</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Digital Receipt Modal (when active) */}
      <ReceiptModal />

      {/* Search Modal (when triggered) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Android APK Download & Install Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />
    </div>
  );
};

export default function App() {
  return (
    <SaruwaProvider>
      <MainAppContent />
    </SaruwaProvider>
  );
}
