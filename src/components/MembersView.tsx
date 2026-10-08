import React, { useState } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import { Member, MemberStatus } from '../types';
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  Phone,
  MapPin,
  Calendar,
  History,
  FileSpreadsheet,
  PlusCircle,
} from 'lucide-react';
import { exportToExcel, exportToCSV } from '../utils/export';

export const MembersView: React.FC = () => {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    getMemberHistory,
    settings,
    openReceiptForRecord,
    startNewCaseForMember,
  } = useSaruwa();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);

  // Form inputs state
  const [formData, setFormData] = useState({
    fullName: '',
    fatherHusbandName: '',
    mobileNumber: '',
    address: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active' as MemberStatus,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mobileNumber.includes(searchQuery) ||
      m.fatherHusbandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      fullName: '',
      fatherHusbandName: '',
      mobileNumber: '',
      address: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName,
      fatherHusbandName: member.fatherHusbandName,
      mobileNumber: member.mobileNumber,
      address: member.address,
      joiningDate: member.joiningDate,
      status: member.status,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.mobileNumber.trim()) {
      alert('Please fill in Member Name and Mobile Number.');
      return;
    }

    if (editingMember) {
      updateMember({
        ...editingMember,
        ...formData,
      });
    } else {
      addMember(formData);
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteMember(id);
    setDeleteConfirmId(null);
    if (viewingMember?.id === id) {
      setViewingMember(null);
    }
  };

  const handleExportExcel = () => {
    const exportData = members.map((m, idx) => ({
      'Sl. No.': idx + 1,
      'Member ID': m.id,
      'Full Name': m.fullName,
      'Father / Husband Name': m.fatherHusbandName,
      'Mobile Number': m.mobileNumber,
      'Address': m.address,
      'Joining Date': m.joiningDate,
      'Status': m.status,
    }));
    exportToExcel(exportData, 'GBT_Tsokpa_Members_List', 'Members');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Tsokpa Member Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage registered Gorkha Buddhist Tsokpa members for Saruwa records
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Member by Name, ID, Phone, Address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs font-medium text-stone-500">Status:</span>
          {(['All', 'Active', 'Inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-stone-900 text-amber-400 font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Father / Husband Name</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500 text-xs">
                    No members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-amber-50/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-950">
                      {member.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      {member.fullName}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {member.fatherHusbandName}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-700">
                      {member.mobileNumber}
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                      {member.address}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {member.joiningDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          member.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => startNewCaseForMember(member)}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-bold transition-colors inline-flex items-center space-x-1 shadow-2xs"
                          title="Create Saruwa Case for this Member's family"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Saruwa Case</span>
                        </button>
                        <button
                          onClick={() => setViewingMember(member)}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="View Details & Saruwa History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-amber-800 hover:bg-amber-100 transition-colors"
                          title="Edit Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(member.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                {editingMember ? 'Edit Member Details' : 'Add New Tsokpa Member'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {editingMember && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Member ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingMember.id}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-xs text-black font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pemba Dorjee Sherpa"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Father / Husband Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Late Mingma Sherpa"
                  value={formData.fatherHusbandName}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherHusbandName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Address (West Kameng District, Bomdila)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Main Market, Bomdila, West Kameng District"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) =>
                      setFormData({ ...formData, joiningDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as MemberStatus,
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                >
                  {editingMember ? 'Save Changes' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Confirm Member Deletion
            </h3>
            <p className="text-xs text-stone-600 mt-2">
              Are you sure you want to remove member{' '}
              <strong className="text-stone-900 font-mono">{deleteConfirmId}</strong>?
              Past paid Saruwa contributions will be preserved for financial transparency.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Details & Saruwa History Modal / Drawer */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-start pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    {viewingMember.id}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      viewingMember.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {viewingMember.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mt-1">
                  {viewingMember.fullName}
                </h3>
                <p className="text-xs text-stone-600">
                  Father/Husband: {viewingMember.fatherHusbandName}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    startNewCaseForMember(viewingMember);
                    setViewingMember(null);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Saruwa Case</span>
                </button>
                <button
                  onClick={() => setViewingMember(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Member Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-stone-200 text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="block text-stone-400 text-[10px]">Mobile</span>
                  <span className="font-mono text-stone-900 font-semibold">{viewingMember.mobileNumber}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="block text-stone-400 text-[10px]">Address</span>
                  <span className="text-stone-900 truncate block max-w-[150px]">{viewingMember.address}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="block text-stone-400 text-[10px]">Joined</span>
                  <span className="text-stone-900">{viewingMember.joiningDate}</span>
                </div>
              </div>
            </div>

            {/* Saruwa Summary for this Member */}
            {(() => {
              const history = getMemberHistory(viewingMember.id);
              return (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <History className="w-4 h-4 text-amber-700" />
                      <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                        Saruwa History
                      </h4>
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Total Saruwa: {settings.currencySymbol}
                      {history.totalContributed.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-stone-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Saruwa Case</th>
                          <th className="py-2.5 px-3">Deceased Person</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Mode</th>
                          <th className="py-2.5 px-3">Receipt No.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {history.records.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-4 text-center text-stone-500">
                              No Saruwa contributions recorded yet.
                            </td>
                          </tr>
                        ) : (
                          history.records.map((rec) => (
                            <tr key={rec.id} className="hover:bg-amber-50/20">
                              <td className="py-2 px-3 text-stone-600">
                                {rec.paymentDate || 'Pending'}
                              </td>
                              <td className="py-2 px-3 font-mono font-medium text-stone-800">
                                {rec.caseId}
                              </td>
                              <td className="py-2 px-3 text-stone-800 font-medium">
                                {rec.deceasedName}
                              </td>
                              <td className="py-2 px-3 font-mono font-bold text-emerald-800">
                                {settings.currencySymbol}
                                {rec.saruwaAmount}
                              </td>
                              <td className="py-2 px-3">
                                {rec.paymentMode ? (
                                  <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">
                                    {rec.paymentMode}
                                  </span>
                                ) : (
                                  <span className="text-amber-800 font-semibold text-[10px]">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3">
                                {rec.receiptNumber ? (
                                  <button
                                    onClick={() => openReceiptForRecord(rec)}
                                    className="font-mono text-amber-800 hover:underline font-bold"
                                    title="View Receipt"
                                  >
                                    {rec.receiptNumber}
                                  </button>
                                ) : (
                                  <span className="text-stone-400">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            <div className="mt-6 pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setViewingMember(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
