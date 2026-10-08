import React, { useRef, useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import {
  Database,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { exportBackupJSON, exportToExcel, exportToCSV } from '../utils/export';

export const BackupRestoreView: React.FC = () => {
  const {
    members,
    cases,
    records,
    settings,
    restoreData,
    resetToDefaults,
  } = useSaruwa();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleBackupJSON = () => {
    const backupPayload = {
      app: 'Gorkha Buddhist Tsokpa - Saruwa Management',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      counts: {
        members: members.length,
        cases: cases.length,
        records: records.length,
      },
      settings,
      members,
      cases,
      records,
    };
    exportBackupJSON(backupPayload, 'Gorkha_Buddhist_Tsokpa_Saruwa_Backup');
    setRestoreStatus({
      type: 'success',
      message: 'Full backup JSON downloaded successfully. Store it in a safe drive.',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.members || !parsed.cases || !parsed.records) {
          throw new Error('Invalid file structure. Required tables missing.');
        }

        const success = restoreData(parsed);
        if (success) {
          setRestoreStatus({
            type: 'success',
            message: `Successfully restored ${parsed.members.length} members, ${parsed.cases.length} cases, and ${parsed.records.length} Saruwa records!`,
          });
        } else {
          throw new Error('Could not restore dataset.');
        }
      } catch (err: any) {
        setRestoreStatus({
          type: 'error',
          message: `Restore failed: ${err.message || 'File corrupted or incorrect format.'}`,
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportAllToExcel = () => {
    const membersData = members.map((m) => ({
      'Member ID': m.id,
      'Full Name': m.fullName,
      'Father / Husband Name': m.fatherHusbandName,
      'Mobile Number': m.mobileNumber,
      'Address': m.address,
      'Joining Date': m.joiningDate,
      'Status': m.status,
    }));

    const recordsData = records.map((r) => {
      const c = cases.find((item) => item.id === r.caseId);
      return {
        'Record ID': r.id,
        'Saruwa Case ID': r.caseId,
        'Deceased Person': c ? c.deceasedName : 'N/A',
        'Member ID': r.memberId,
        'Member Name': r.memberName,
        'Mobile Number': r.mobileNumber,
        'Saruwa Amount (₹)': r.saruwaAmount,
        'Status': r.status,
        'Payment Mode': r.paymentMode || '',
        'Payment Date': r.paymentDate || '',
        'Receipt Number': r.receiptNumber || '',
        'Remarks': r.remarks || '',
      };
    });

    exportToExcel(recordsData, 'GBT_Complete_Saruwa_Records_Backup', 'All Saruwa Records');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-1">
          <Database className="w-3.5 h-3.5" />
          <span>Data Safety &amp; Preservation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
          Backup &amp; Restore Data
        </h2>
        <p className="text-xs text-stone-500">
          Ensure Tsokpa community records are securely backed up offline and recoverable at any time
        </p>
      </div>

      {/* Status banner */}
      {restoreStatus.type && (
        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
            restoreStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {restoreStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <div>
            <span className="font-bold block">
              {restoreStatus.type === 'success' ? 'Success' : 'Error'}
            </span>
            <p className="mt-0.5">{restoreStatus.message}</p>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="text-amber-400 block font-semibold">Local Storage Protection</strong>
          All Saruwa records, members, and cases are saved directly into your device browser storage.
          Existing records remain completely safe when adding new members or cases. We recommend taking regular weekly backups.
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. Backup Data Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Download Full Backup (JSON)
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Downloads a complete snapshot of all members ({members.length}), cases ({cases.length}),
              and Saruwa collection records ({records.length}).
            </p>
          </div>

          <button
            onClick={handleBackupJSON}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Backup File</span>
          </button>
        </div>

        {/* 2. Restore Data Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Restore Data from File
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Upload a previously downloaded JSON backup file to restore committee records on any device.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="restore-file-input"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Select File to Restore</span>
            </button>
          </div>
        </div>

        {/* 3. Export Excel / CSV */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Export All Records (Excel / Sheets)
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Exports full spreadsheets of all members and Saruwa collections formatted for Microsoft Excel or Google Sheets.
            </p>
          </div>

          <button
            onClick={handleExportAllToExcel}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export to Excel (.xlsx)</span>
          </button>
        </div>

        {/* 4. Reset to Initial Sample Data */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Reset to Sample Community Data
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Reload the official sample Gorkha Buddhist Tsokpa members, cases, and Saruwa receipts.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reload sample Tsokpa records? Any unbacked-up custom edits will be replaced.')) {
                resetToDefaults();
                setRestoreStatus({
                  type: 'success',
                  message: 'Successfully reloaded default Tsokpa records.',
                });
              }
            }}
            className="w-full py-2.5 px-4 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Reload Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
