import React from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import { DharmachakraIcon } from './BuddhistIcons';
import { Menu, Clock, Search, Smartphone } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenApkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSearch, onOpenApkModal }) => {
  const { settings, records, setActiveTab } = useSaruwa();
  const pendingRecordsCount = records.filter((r) => r.status === 'Pending').length;

  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 shadow-md border-b border-amber-900/40 no-print">
      {/* Android-style Status Bar strip feel */}
      <div className="bg-stone-950 px-4 py-1 text-[11px] text-stone-400 flex justify-between items-center select-none border-b border-stone-800/60">
        <span className="font-medium text-amber-400/90 tracking-wider">
          GORKHA BUDDHIST TSOKPA
        </span>
        <div className="flex items-center space-x-3 text-stone-400">
          <span>{settings.registrationNumber}</span>
          <span>·</span>
          <span>West Kameng District, Bomdila</span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg focus:outline-none transition-colors"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-stone-950 shadow-inner">
              <DharmachakraIcon className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors leading-tight">
                {settings.orgName}
              </h1>
              <p className="text-[11px] text-amber-400 font-medium tracking-wide">
                Saruwa Management System
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* APK / Install App Button */}
          <button
            onClick={onOpenApkModal}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors shadow-xs"
            title="Download APK / Install on Android"
          >
            <Smartphone className="w-4 h-4 text-stone-950" />
            <span className="hidden sm:inline">Install App / APK</span>
          </button>

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg text-xs transition-colors border border-stone-700/60"
            title="Search Member or Saruwa Record"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Quick Search</span>
          </button>

          {/* Pending Saruwa Indicator */}
          <button
            onClick={() => setActiveTab('pending-saruwa')}
            className="relative p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title={`${pendingRecordsCount} Pending Saruwa Records`}
          >
            <Clock className="w-5 h-5 text-amber-400" />
            {pendingRecordsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-stone-950">
                {pendingRecordsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
