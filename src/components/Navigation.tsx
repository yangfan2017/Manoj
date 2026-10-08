import React from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  FolderHeart,
  HandCoins,
  Clock,
  Receipt,
  History,
  FileSpreadsheet,
  Database,
  Settings,
  X,
  ChevronRight,
  Smartphone,
} from 'lucide-react';
import { DharmachakraIcon } from './BuddhistIcons';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApkModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, onOpenApkModal }) => {
  const { activeTab, setActiveTab, records, cases } = useSaruwa();
  const pendingCount = records.filter((r) => r.status === 'Pending').length;
  const activeCasesCount = cases.filter((c) => c.status === 'Active').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'members', label: '2. Members', icon: Users },
    { id: 'new-saruwa', label: '3. New Saruwa', icon: PlusCircle },
    { id: 'saruwa-cases', label: '4. Saruwa Cases', icon: FolderHeart, badge: activeCasesCount },
    { id: 'saruwa-collection', label: '5. Saruwa Collection', icon: HandCoins },
    { id: 'pending-saruwa', label: '6. Pending Saruwa', icon: Clock, badge: pendingCount },
    { id: 'saruwa-receipts', label: '7. Saruwa Receipts', icon: Receipt },
    { id: 'saruwa-history', label: '8. Saruwa History', icon: History },
    { id: 'reports', label: '9. Reports', icon: FileSpreadsheet },
    { id: 'backup-restore', label: '10. Backup & Restore', icon: Database },
    { id: 'settings', label: '11. Settings', icon: Settings },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Drawer Overlay for Mobile / Desktop Drawer Mode */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity no-print"
          onClick={onClose}
        />
      )}

      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-stone-900 text-stone-100 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-600/90 flex items-center justify-center text-stone-950 font-bold shadow-md">
              <DharmachakraIcon className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Gorkha Buddhist Tsokpa
              </h2>
              <p className="text-[11px] text-amber-400 font-medium">
                Saruwa Management Committee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-400/80">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-600 text-stone-950 font-semibold shadow-md'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-stone-950' : 'text-amber-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                        isActive
                          ? 'bg-stone-950 text-amber-400'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 opacity-50 ${
                      isActive ? 'text-stone-950' : 'text-stone-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Android APK / App Install Section */}
        {onOpenApkModal && (
          <div className="p-3 mx-3 my-2 bg-stone-950/80 rounded-xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block leading-tight">Android App</span>
                <span className="text-[10px] text-stone-400 block">Download APK / Install</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenApkModal();
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-[11px] transition-colors"
            >
              Get APK
            </button>
          </div>
        )}

        {/* Drawer Footer */}
        <div className="p-3.5 bg-stone-950 border-t border-stone-800/80 text-[11px] text-stone-400 text-center space-y-1">
          <p className="font-semibold text-stone-300">Tsokpa Committee Portal</p>
          <p className="text-[10px] text-stone-500">
            Solemn &amp; Transparent Saruwa Care
          </p>
          <div className="pt-1.5 mt-1 border-t border-stone-900 text-[10px] text-amber-400 font-medium">
            Software Developed by <strong className="text-stone-200 tracking-wide">Manoj Kumar Tamang</strong>
          </div>
        </div>
      </aside>

      {/* Mobile Android Bottom Quick Bar (Only visible on small screens) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-stone-900 border-t border-stone-800 text-stone-300 flex items-center justify-around py-1.5 px-2 lg:hidden no-print shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'hover:text-stone-100'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('saruwa-collection')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'saruwa-collection' ? 'text-amber-400 font-bold' : 'hover:text-stone-100'
          }`}
        >
          <HandCoins className="w-5 h-5 mb-0.5" />
          <span>Collection</span>
        </button>

        <button
          onClick={() => setActiveTab('new-saruwa')}
          className="flex flex-col items-center -mt-4 py-1 px-2"
        >
          <div className="w-11 h-11 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center shadow-lg border-2 border-stone-900 active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-bold text-amber-400 mt-0.5">New Saruwa</span>
        </button>

        <button
          onClick={() => setActiveTab('pending-saruwa')}
          className={`relative flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'pending-saruwa' ? 'text-amber-400 font-bold' : 'hover:text-stone-100'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          {pendingCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-amber-500 text-[9px] text-stone-950 font-black flex items-center justify-center">
              {pendingCount}
            </span>
          )}
          <span>Pending</span>
        </button>

        <button
          onClick={onClose}
          className="flex flex-col items-center py-1 px-2 text-[10px] font-medium hover:text-stone-100"
          title="All Menu Options"
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
