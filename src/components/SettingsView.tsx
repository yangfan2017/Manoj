import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import { Settings as SettingsIcon, Save, CheckCircle2 } from 'lucide-react';
import { DharmachakraIcon } from './BuddhistIcons';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useSaruwa();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      defaultSaruwaAmount: Number(formData.defaultSaruwaAmount) || 500,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-1">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Committee Configuration</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
          Tsokpa Settings
        </h2>
        <p className="text-xs text-stone-500">
          Configure committee details, official letterhead, and default Saruwa amounts
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-900 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully! Receipts will now reflect the updated committee information.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
        
        {/* Organization Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 pb-2 border-b border-stone-200 flex items-center space-x-2">
            <DharmachakraIcon className="w-4 h-4 text-amber-600" />
            <span>Organization Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                required
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formData.orgSubtitle}
                onChange={(e) => setFormData({ ...formData, orgSubtitle: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Registration Number
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Default Saruwa Amount Per Member (₹)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={formData.defaultSaruwaAmount}
                onChange={(e) =>
                  setFormData({ ...formData, defaultSaruwaAmount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tsokpa Office Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Committee Leaders (Shown on Receipts & Reports) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 pb-2 border-b border-stone-200">
            Committee Signatories &amp; Officers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                President Name
              </label>
              <input
                type="text"
                value={formData.presidentName}
                onChange={(e) => setFormData({ ...formData, presidentName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                General Secretary Name
              </label>
              <input
                type="text"
                value={formData.secretaryName}
                onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Treasurer Name
              </label>
              <input
                type="text"
                value={formData.treasurerName}
                onChange={(e) => setFormData({ ...formData, treasurerName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Software Development Attribution Card */}
      <div className="bg-stone-900 text-stone-200 rounded-2xl border border-stone-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Application Development Credits
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Gorkha Buddhist Tsokpa – Saruwa Management
          </h4>
          <p className="text-xs text-stone-400 mt-0.5">
            Dedicated digital system for community Saruwa assistance and record-keeping
          </p>
        </div>

        <div className="bg-stone-950 border border-stone-800 px-4 py-2.5 rounded-xl text-right sm:text-right">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
            APPLICATION ENGINEER
          </span>
          <span className="text-sm font-black text-amber-400 tracking-wider block mt-0.5">
            Software Developed by Manoj Kumar Tamang
          </span>
        </div>
      </div>
    </div>
  );
};
