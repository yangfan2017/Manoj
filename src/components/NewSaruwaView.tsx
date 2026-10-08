import React, { useState, useEffect } from 'react';
import { useSaruwa } from '../context/SaruwaContext';
import { Member } from '../types';
import {
  PlusCircle,
  Calendar,
  Phone,
  MapPin,
  User,
  Search,
  CheckCircle2,
  UserCheck,
  UserPlus,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { DharmachakraIcon } from './BuddhistIcons';

export const NewSaruwaView: React.FC = () => {
  const {
    addCase,
    addMember,
    setActiveTab,
    setSelectedCaseId,
    settings,
    members,
    selectedMemberForNewCase,
    setSelectedMemberForNewCase,
  } = useSaruwa();

  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Selected Member state
  const [chosenMember, setChosenMember] = useState<Member | null>(() => {
    return selectedMemberForNewCase || null;
  });

  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showQuickAddMember, setShowQuickAddMember] = useState(false);

  // Quick Member Form state
  const [quickMember, setQuickMember] = useState({
    fullName: '',
    fatherHusbandName: '',
    mobileNumber: '',
    address: 'Bomdila, West Kameng District',
    joiningDate: today,
    status: 'Active' as const,
  });

  // Bereavement Case Form state
  const [caseForm, setCaseForm] = useState({
    deceasedName: '',
    relationship: 'Father',
    otherRelationship: '',
    deathDate: today,
    address: '',
    contactPerson: '',
    contactNumber: '',
    collectionStartDate: today,
    collectionEndDate: defaultEnd,
    notes: '',
    defaultSaruwaAmount: settings.defaultSaruwaAmount || 530,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState('');

  // If context had a preselected member (e.g. from Members list)
  useEffect(() => {
    if (selectedMemberForNewCase) {
      handleSelectMember(selectedMemberForNewCase);
    }
  }, [selectedMemberForNewCase]);

  const handleSelectMember = (member: Member) => {
    setChosenMember(member);
    setCaseForm((prev) => ({
      ...prev,
      address: member.address || 'Bomdila, West Kameng District',
      contactPerson: member.fullName,
      contactNumber: member.mobileNumber,
    }));
  };

  const handleQuickAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMember.fullName.trim() || !quickMember.mobileNumber.trim()) {
      alert('Please enter member name and mobile number.');
      return;
    }

    const created = addMember(quickMember);
    setShowQuickAddMember(false);
    handleSelectMember(created);
  };

  const handleSubmitCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenMember) {
      alert('Please select a Tsokpa Member first.');
      return;
    }
    if (!caseForm.deceasedName.trim()) {
      alert('Please enter Name of Deceased Person.');
      return;
    }

    const relationText =
      caseForm.relationship === 'Other'
        ? caseForm.otherRelationship || 'Family Member'
        : caseForm.relationship;

    const familyNameWithRelation = `${chosenMember.fullName} (${relationText})`;

    const created = addCase({
      deceasedName: caseForm.deceasedName.trim(),
      familyMemberName: familyNameWithRelation,
      associatedMemberId: chosenMember.id,
      deathDate: caseForm.deathDate,
      address: caseForm.address || chosenMember.address,
      contactPerson: caseForm.contactPerson || chosenMember.fullName,
      contactNumber: caseForm.contactNumber || chosenMember.mobileNumber,
      collectionStartDate: caseForm.collectionStartDate,
      collectionEndDate: caseForm.collectionEndDate,
      notes: caseForm.notes,
      status: 'Active',
      defaultSaruwaAmount: Number(caseForm.defaultSaruwaAmount) || 530,
    });

    setCreatedCaseId(created.id);
    setSelectedCaseId(created.id);
    setIsSuccess(true);
    setSelectedMemberForNewCase(null);
  };

  // Filter members list for selection
  const filteredMembers = members.filter((m) => {
    const q = memberSearchQuery.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.mobileNumber.includes(q) ||
      m.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              Create Saruwa Case from Member
            </h2>
            <p className="text-xs text-stone-500">
              Select the Tsokpa member whose family has experienced a bereavement to initiate community Saruwa collection
            </p>
          </div>
        </div>
        <DharmachakraIcon className="w-8 h-8 text-amber-500/40 hidden sm:block" />
      </div>

      {isSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-950">
              Saruwa Case Created Successfully
            </h3>
            <p className="text-xs text-emerald-800 mt-1">
              Case ID: <span className="font-mono font-bold">{createdCaseId}</span> · Member: <strong className="text-stone-900">{chosenMember?.fullName}</strong>
            </p>
            <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto">
              Saruwa collection records have been automatically prepared for all active Tsokpa members.
            </p>
          </div>

          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => setActiveTab('saruwa-collection')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              Start Saruwa Collection Now
            </button>
            <button
              onClick={() => {
                setIsSuccess(false);
                setChosenMember(null);
                setCaseForm({
                  deceasedName: '',
                  relationship: 'Father',
                  otherRelationship: '',
                  deathDate: today,
                  address: '',
                  contactPerson: '',
                  contactNumber: '',
                  collectionStartDate: today,
                  collectionEndDate: defaultEnd,
                  notes: '',
                  defaultSaruwaAmount: settings.defaultSaruwaAmount || 530,
                });
              }}
              className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold rounded-xl text-xs"
            >
              Create Another Case
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* STEP 1: SELECT OR ADD MEMBER */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                  Select Tsokpa Member
                </h3>
              </div>

              {!chosenMember && (
                <button
                  type="button"
                  onClick={() => setShowQuickAddMember(!showQuickAddMember)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{showQuickAddMember ? 'Cancel Member Form' : '+ New Member'}</span>
                </button>
              )}
            </div>

            {/* Quick Add Member Drawer if needed */}
            {showQuickAddMember && !chosenMember && (
              <form
                onSubmit={handleQuickAddMemberSubmit}
                className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-3"
              >
                <div className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Quick Register Member
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dorjee Khandu Tamang"
                      value={quickMember.fullName}
                      onChange={(e) =>
                        setQuickMember({ ...quickMember, fullName: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={quickMember.mobileNumber}
                      onChange={(e) =>
                        setQuickMember({ ...quickMember, mobileNumber: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Father / Husband Name
                    </label>
                    <input
                      type="text"
                      placeholder="Father / Husband Name"
                      value={quickMember.fatherHusbandName}
                      onChange={(e) =>
                        setQuickMember({ ...quickMember, fatherHusbandName: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Address (West Kameng District)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main Market, Bomdila, West Kameng District"
                      value={quickMember.address}
                      onChange={(e) =>
                        setQuickMember({ ...quickMember, address: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs text-black bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickAddMember(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 border border-stone-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs"
                  >
                    Save &amp; Select Member
                  </button>
                </div>
              </form>
            )}

            {/* If Member is Chosen */}
            {chosenMember ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5 text-amber-900" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-950 bg-amber-200/80 px-2 py-0.2 rounded">
                        {chosenMember.id}
                      </span>
                      <span className="font-bold text-stone-900 text-sm">
                        {chosenMember.fullName}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 mt-0.5">
                      Mobile: <strong className="font-mono text-stone-900">{chosenMember.mobileNumber}</strong> · Father/Husband: {chosenMember.fatherHusbandName}
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Address: {chosenMember.address}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChosenMember(null)}
                  className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg self-start sm:self-center transition-colors"
                >
                  Change Member
                </button>
              </div>
            ) : (
              /* Searchable Member Picker List */
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search member by name, mobile, address in Bomdila..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-xs text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 border border-stone-200 rounded-xl">
                  {filteredMembers.length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-500">
                      No members found matching your search. Click "+ New Member" to add one.
                    </div>
                  ) : (
                    filteredMembers.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMember(m)}
                        className="p-3 hover:bg-amber-50/40 cursor-pointer transition-colors flex items-center justify-between text-xs group"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded text-[11px]">
                              {m.id}
                            </span>
                            <span className="font-bold text-stone-900 group-hover:text-amber-900">
                              {m.fullName}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Mobile: <span className="font-mono text-stone-700">{m.mobileNumber}</span> · {m.address}
                          </p>
                        </div>

                        <span className="px-2.5 py-1 bg-stone-100 group-hover:bg-amber-600 group-hover:text-stone-950 text-stone-700 rounded-lg text-[11px] font-bold transition-colors">
                          Select
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: BEREAVEMENT & SARUWA DETAILS */}
          {chosenMember && (
            <form
              onSubmit={handleSubmitCase}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-5"
            >
              <div className="flex items-center space-x-2 pb-3 border-b border-stone-200">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                  Bereavement &amp; Saruwa Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Deceased Person Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Name of Deceased Person <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Late Meme Nima Wangdi Sherpa"
                    value={caseForm.deceasedName}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, deceasedName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    This name will appear on official receipts and community WhatsApp messages.
                  </span>
                </div>

                {/* Relationship to Member */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Relationship to Member ({chosenMember.fullName}) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={caseForm.relationship}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, relationship: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Husband">Husband</option>
                    <option value="Wife">Wife</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Grandfather">Grandfather (Meme)</option>
                    <option value="Grandmother">Grandmother (Mobi/Aama)</option>
                    <option value="Other">Other Relative</option>
                  </select>
                </div>

                {/* If Other Relationship */}
                {caseForm.relationship === 'Other' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Specify Relationship
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Uncle / Aunt / In-law"
                      value={caseForm.otherRelationship}
                      onChange={(e) =>
                        setCaseForm({ ...caseForm, otherRelationship: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black bg-white"
                    />
                  </div>
                )}

                {/* Date of Death */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date of Death <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={caseForm.deathDate}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, deathDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={caseForm.contactPerson}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, contactPerson: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black bg-white"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={caseForm.contactNumber}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, contactNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black bg-white"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mourning Address (West Kameng District, Bomdila)
                  </label>
                  <input
                    type="text"
                    value={caseForm.address}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black bg-white"
                  />
                </div>

                {/* Collection Dates */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Saruwa Collection Start Date
                  </label>
                  <input
                    type="date"
                    value={caseForm.collectionStartDate}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, collectionStartDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Saruwa Collection End Date
                  </label>
                  <input
                    type="date"
                    value={caseForm.collectionEndDate}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, collectionEndDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black bg-white"
                  />
                </div>

                {/* Fixed Saruwa Amount */}
                <div className="md:col-span-2 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Fixed Saruwa Amount Per Member (₹)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-stone-700 font-bold">₹</span>
                    <input
                      type="number"
                      min="10"
                      step="10"
                      value={caseForm.defaultSaruwaAmount}
                      onChange={(e) =>
                        setCaseForm({
                          ...caseForm,
                          defaultSaruwaAmount: Number(e.target.value),
                        })
                      }
                      className="w-44 px-3 py-1.5 border border-amber-300 rounded-lg text-sm text-black font-mono font-bold bg-white"
                    />
                    <span className="text-xs text-stone-600">
                      Standard contribution rate for all Tsokpa members.
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Notes &amp; Ritual Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Details of Ghewa, Shegu (49th day prayer), funeral place, Tsokpa assistance..."
                    value={caseForm.notes}
                    onChange={(e) =>
                      setCaseForm({ ...caseForm, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-black bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setChosenMember(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Saruwa Case &amp; Initialize Collection</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
