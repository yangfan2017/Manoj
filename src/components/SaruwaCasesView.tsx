import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import { SaruwaCase } from '../types';
import {
  FolderHeart,
  PlusCircle,
  Calendar,
  Phone,
  HandCoins,
  FileSpreadsheet,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  X,
} from 'lucide-react';

export const SaruwaCasesView: React.FC = () => {
  const {
    cases,
    updateCase,
    deleteCase,
    getCaseStats,
    setActiveTab,
    setSelectedCaseId,
    settings,
  } = useSaruwa();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('All');
  const [editingCase, setEditingCase] = useState<SaruwaCase | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.deceasedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.familyMemberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (caseItem: SaruwaCase) => {
    const newStatus = caseItem.status === 'Active' ? 'Completed' : 'Active';
    updateCase({
      ...caseItem,
      status: newStatus,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;
    updateCase(editingCase);
    setEditingCase(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Saruwa Cases
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Community Saruwa records organized by bereavement case
          </p>
        </div>

        <button
          onClick={() => setActiveTab('new-saruwa')}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Saruwa Case</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Deceased, Case ID, Family..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs font-medium text-stone-500">Filter:</span>
          {(['All', 'Active', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === st
                  ? 'bg-stone-900 text-amber-400 font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500 text-xs">
            No Saruwa cases found matching your criteria.
          </div>
        ) : (
          filteredCases.map((c) => {
            const stats = getCaseStats(c.id);
            const progress = stats.totalMembers > 0 ? Math.round((stats.paidCount / stats.totalMembers) * 100) : 0;

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-amber-300 transition-all p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          c.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {c.status} Case
                      </span>
                      <span className="text-stone-400 text-xs">·</span>
                      <span className="text-xs text-stone-500">
                        Date of Death: <strong>{c.deathDate}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className="px-2 py-1 rounded text-[11px] font-medium border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
                        title="Change Status"
                      >
                        Mark as {c.status === 'Active' ? 'Completed' : 'Active'}
                      </button>
                      <button
                        onClick={() => setEditingCase(c)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-amber-800 hover:bg-amber-50"
                        title="Edit Case Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(c.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50"
                        title="Delete Case"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                    {/* Left: Deceased & Family info */}
                    <div className="lg:col-span-2 space-y-1.5">
                      <h3 className="text-lg font-bold text-stone-900">
                        {c.deceasedName}
                      </h3>
                      <p className="text-xs text-stone-600">
                        <strong className="text-stone-700">Family / Member:</strong> {c.familyMemberName}
                      </p>
                      <p className="text-xs text-stone-600">
                        <strong className="text-stone-700">Address:</strong> {c.address}
                      </p>
                      <p className="text-xs text-stone-600">
                        <strong className="text-stone-700">Contact:</strong> {c.contactPerson} ({c.contactNumber})
                      </p>
                      <p className="text-xs text-stone-500">
                        <strong className="text-stone-700">Collection Window:</strong> {c.collectionStartDate} to {c.collectionEndDate}
                      </p>
                      {c.notes && (
                        <p className="text-xs text-stone-500 italic mt-1 bg-stone-50 p-2 rounded-lg">
                          “{c.notes}”
                        </p>
                      )}
                    </div>

                    {/* Right: Saruwa Financial Progress */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-stone-600">Total Saruwa Collected</span>
                          <span className="font-mono font-bold text-emerald-800 text-sm">
                            {settings.currencySymbol}{stats.totalCollected.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="text-stone-500">Total Pending Saruwa</span>
                          <span className="font-mono font-medium text-amber-900">
                            {settings.currencySymbol}{stats.totalPending.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-500 mt-1.5">
                          <span>Paid: {stats.paidCount}</span>
                          <span>Pending: {stats.pendingCount}</span>
                          <span>Total: {stats.totalMembers}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between gap-2">
                        <button
                          onClick={() => {
                            setSelectedCaseId(c.id);
                            setActiveTab('saruwa-collection');
                          }}
                          className="flex-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1"
                        >
                          <HandCoins className="w-3.5 h-3.5" />
                          <span>Collection</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCaseId(c.id);
                            setActiveTab('reports');
                          }}
                          className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                Edit Saruwa Case: {editingCase.id}
              </h3>
              <button
                onClick={() => setEditingCase(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Name of Deceased Person
                </label>
                <input
                  type="text"
                  required
                  value={editingCase.deceasedName}
                  onChange={(e) =>
                    setEditingCase({ ...editingCase, deceasedName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Name of Family / Member
                </label>
                <input
                  type="text"
                  required
                  value={editingCase.familyMemberName}
                  onChange={(e) =>
                    setEditingCase({ ...editingCase, familyMemberName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date of Death
                  </label>
                  <input
                    type="date"
                    value={editingCase.deathDate}
                    onChange={(e) =>
                      setEditingCase({ ...editingCase, deathDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Case Status
                  </label>
                  <select
                    value={editingCase.status}
                    onChange={(e) =>
                      setEditingCase({
                        ...editingCase,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editingCase.address}
                  onChange={(e) =>
                    setEditingCase({ ...editingCase, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={editingCase.contactPerson}
                    onChange={(e) =>
                      setEditingCase({ ...editingCase, contactPerson: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={editingCase.contactNumber}
                    onChange={(e) =>
                      setEditingCase({ ...editingCase, contactNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editingCase.notes}
                  onChange={(e) =>
                    setEditingCase({ ...editingCase, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs"
                >
                  Update Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Confirm Case Deletion
            </h3>
            <p className="text-xs text-stone-600 mt-2">
              Are you sure you want to delete case{' '}
              <strong className="text-stone-900 font-mono">{deleteConfirmId}</strong>?
              All associated Saruwa collection records will also be removed.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCase(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Delete Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
