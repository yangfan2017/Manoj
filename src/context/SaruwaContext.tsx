import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Member,
  SaruwaCase,
  SaruwaRecord,
  TsokpaSettings,
  ActiveTab,
  SaruwaReceiptData,
  PaymentMode,
} from '../types';
import { initialMembers, initialCases, initialRecords, initialSettings } from '../data/initialData';

interface SaruwaContextType {
  members: Member[];
  cases: SaruwaCase[];
  records: SaruwaRecord[];
  settings: TsokpaSettings;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  activeReceipt: SaruwaReceiptData | null;
  setActiveReceipt: (receipt: SaruwaReceiptData | null) => void;
  selectedMemberForNewCase: Member | null;
  setSelectedMemberForNewCase: (member: Member | null) => void;
  startNewCaseForMember: (member: Member) => void;
  
  // Overall Dashboard Stats
  totalMembersCount: number;
  activeMembersCount: number;
  activeCasesCount: number;
  totalSaruwaCollected: number;
  totalPendingSaruwa: number;
  cashSaruwa: number;
  upiSaruwa: number;
  bankSaruwa: number;

  // Case specific helper
  getCaseStats: (caseId: string) => {
    totalMembers: number;
    paidCount: number;
    pendingCount: number;
    totalCollected: number;
    totalPending: number;
    cashAmount: number;
    upiAmount: number;
    bankAmount: number;
  };

  // Member-wise history helper
  getMemberHistory: (memberId: string) => {
    records: (SaruwaRecord & { deceasedName: string; caseId: string })[];
    totalContributed: number;
    paidCount: number;
    pendingCount: number;
  };

  // Member CRUD
  addMember: (data: Omit<Member, 'id' | 'createdAt'>) => Member;
  updateMember: (member: Member) => void;
  deleteMember: (memberId: string) => void;

  // Case CRUD
  addCase: (data: Omit<SaruwaCase, 'id' | 'createdAt'>) => SaruwaCase;
  updateCase: (caseItem: SaruwaCase) => void;
  deleteCase: (caseId: string) => void;

  // Saruwa Collection Actions
  recordSaruwaPayment: (
    recordId: string,
    details: {
      saruwaAmount: number;
      paymentMode: PaymentMode;
      paymentDate: string;
      remarks?: string;
      receiptNumber?: string;
    }
  ) => SaruwaReceiptData;
  revertSaruwaToPending: (recordId: string) => void;

  // Receipts
  getAllReceipts: () => SaruwaReceiptData[];
  getReceiptByNumber: (receiptNumber: string) => SaruwaReceiptData | null;
  openReceiptForRecord: (record: SaruwaRecord) => void;

  // Settings & Data Management
  updateSettings: (newSettings: TsokpaSettings) => void;
  restoreData: (data: {
    members: Member[];
    cases: SaruwaCase[];
    records: SaruwaRecord[];
    settings?: TsokpaSettings;
  }) => boolean;
  resetToDefaults: () => void;
}

const SaruwaContext = createContext<SaruwaContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MEMBERS: 'gbt_saruwa_members_v1',
  CASES: 'gbt_saruwa_cases_v1',
  RECORDS: 'gbt_saruwa_records_v1',
  SETTINGS: 'gbt_saruwa_settings_v1',
};

export const SaruwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Members
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: Member) => {
          if (m.address && m.address.includes('Darjeeling')) {
            const matched = initialMembers.find((initM) => initM.id === m.id);
            return matched
              ? { ...m, address: matched.address, mobileNumber: matched.mobileNumber }
              : { ...m, address: m.address.replace(/Darjeeling/g, 'Bomdila, West Kameng District') };
          }
          return m;
        });
      }
      return initialMembers;
    } catch {
      return initialMembers;
    }
  });

  // Cases
  const [cases, setCases] = useState<SaruwaCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CASES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((c: SaruwaCase) => {
          let updatedCase = { ...c };
          if (updatedCase.address && updatedCase.address.includes('Darjeeling')) {
            const matched = initialCases.find((initC) => initC.id === updatedCase.id);
            updatedCase = matched
              ? { ...updatedCase, address: matched.address, notes: matched.notes }
              : { ...updatedCase, address: updatedCase.address.replace(/Darjeeling/g, 'Bomdila, West Kameng District') };
          }
          if (updatedCase.defaultSaruwaAmount === 500) {
            updatedCase.defaultSaruwaAmount = 530;
          }
          return updatedCase;
        });
      }
      return initialCases;
    } catch {
      return initialCases;
    }
  });

  // Records
  const [records, setRecords] = useState<SaruwaRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((r: SaruwaRecord) => {
          if (r.saruwaAmount === 500) {
            return { ...r, saruwaAmount: 530 };
          }
          return r;
        });
      }
      return initialRecords;
    } catch {
      return initialRecords;
    }
  });

  // Settings
  const [settings, setSettings] = useState<TsokpaSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.address && parsed.address.includes('Darjeeling')) {
          parsed.address = initialSettings.address;
        }
        if (!parsed.registrationNumber || parsed.registrationNumber.includes('108') || parsed.registrationNumber.includes('GST/') || parsed.registrationNumber.includes('GBT/AR') || parsed.registrationNumber.includes('GBT/WB')) {
          parsed.registrationNumber = 'GBT/BDL/ESTD-2021';
        }
        if (!parsed.defaultSaruwaAmount || parsed.defaultSaruwaAmount === 500) {
          parsed.defaultSaruwaAmount = 530;
        }
        return parsed;
      }
      return initialSettings;
    } catch {
      return initialSettings;
    }
  });

  // Navigation & Case-Member linking state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    return initialCases[0]?.id || '';
  });
  const [activeReceipt, setActiveReceipt] = useState<SaruwaReceiptData | null>(null);
  const [selectedMemberForNewCase, setSelectedMemberForNewCase] = useState<Member | null>(null);

  const startNewCaseForMember = (member: Member) => {
    setSelectedMemberForNewCase(member);
    setActiveTab('new-saruwa');
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error('Failed to save members', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    } catch (e) {
      console.error('Failed to save cases', e);
    }
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records', e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Overall calculations
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter((m) => m.status === 'Active').length;
  const activeCasesCount = cases.filter((c) => c.status === 'Active').length;

  const totalSaruwaCollected = useMemo(() => {
    return records
      .filter((r) => r.status === 'Paid')
      .reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
  }, [records]);

  const totalPendingSaruwa = useMemo(() => {
    return records
      .filter((r) => r.status === 'Pending')
      .reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
  }, [records]);

  const cashSaruwa = useMemo(() => {
    return records
      .filter((r) => r.status === 'Paid' && r.paymentMode === 'Cash')
      .reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
  }, [records]);

  const upiSaruwa = useMemo(() => {
    return records
      .filter((r) => r.status === 'Paid' && r.paymentMode === 'UPI')
      .reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
  }, [records]);

  const bankSaruwa = useMemo(() => {
    return records
      .filter((r) => r.status === 'Paid' && r.paymentMode === 'Bank')
      .reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
  }, [records]);

  // Case Stats Helper
  const getCaseStats = (caseId: string) => {
    const caseRecords = records.filter((r) => r.caseId === caseId);
    const paidRecords = caseRecords.filter((r) => r.status === 'Paid');
    const pendingRecords = caseRecords.filter((r) => r.status === 'Pending');

    const totalCollected = paidRecords.reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
    const totalPending = pendingRecords.reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
    const cashAmount = paidRecords
      .filter((r) => r.paymentMode === 'Cash')
      .reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
    const upiAmount = paidRecords
      .filter((r) => r.paymentMode === 'UPI')
      .reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);
    const bankAmount = paidRecords
      .filter((r) => r.paymentMode === 'Bank')
      .reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);

    return {
      totalMembers: caseRecords.length,
      paidCount: paidRecords.length,
      pendingCount: pendingRecords.length,
      totalCollected,
      totalPending,
      cashAmount,
      upiAmount,
      bankAmount,
    };
  };

  // Member History Helper
  const getMemberHistory = (memberId: string) => {
    const memberRecords = records
      .filter((r) => r.memberId === memberId)
      .map((r) => {
        const c = cases.find((item) => item.id === r.caseId);
        return {
          ...r,
          deceasedName: c ? c.deceasedName : 'N/A',
          caseId: r.caseId,
        };
      });

    const paidRecords = memberRecords.filter((r) => r.status === 'Paid');
    const pendingRecords = memberRecords.filter((r) => r.status === 'Pending');
    const totalContributed = paidRecords.reduce((sum, r) => sum + (Number(r.saruwaAmount) || 0), 0);

    return {
      records: memberRecords,
      totalContributed,
      paidCount: paidRecords.length,
      pendingCount: pendingRecords.length,
    };
  };

  // Member CRUD
  const addMember = (data: Omit<Member, 'id' | 'createdAt'>): Member => {
    // Generate new Member ID (e.g. GBT-113)
    const existingNums = members
      .map((m) => {
        const match = m.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 101;
    const newId = `GBT-${nextNum}`;

    const newMember: Member = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setMembers((prev) => [...prev, newMember]);

    // Automatically create pending collection records for all ACTIVE Saruwa cases
    const activeCases = cases.filter((c) => c.status === 'Active');
    if (activeCases.length > 0 && newMember.status === 'Active') {
      const newRecords: SaruwaRecord[] = activeCases.map((c) => ({
        id: `REC-${c.id}-${newMember.id}-${Date.now()}`,
        caseId: c.id,
        memberId: newMember.id,
        memberName: newMember.fullName,
        mobileNumber: newMember.mobileNumber,
        saruwaAmount: c.defaultSaruwaAmount || settings.defaultSaruwaAmount || 530,
        status: 'Pending',
        paymentDate: null,
        paymentMode: null,
        receiptNumber: null,
        remarks: '',
        updatedAt: new Date().toISOString(),
      }));

      setRecords((prev) => [...prev, ...newRecords]);
    }

    return newMember;
  };

  const updateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    // Also update member name & phone in records
    setRecords((prev) =>
      prev.map((r) =>
        r.memberId === updated.id
          ? {
              ...r,
              memberName: updated.fullName,
              mobileNumber: updated.mobileNumber,
            }
          : r
      )
    );
  };

  const deleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    // Remove pending records for this member, retain paid records for historical integrity or remove
    setRecords((prev) => prev.filter((r) => !(r.memberId === memberId && r.status === 'Pending')));
  };

  // Case CRUD
  const addCase = (data: Omit<SaruwaCase, 'id' | 'createdAt'>): SaruwaCase => {
    const year = new Date().getFullYear();
    const existingCaseNums = cases
      .map((c) => {
        const match = c.id.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const nextCaseNum = existingCaseNums.length > 0 ? Math.max(...existingCaseNums) + 1 : 1;
    const formattedNum = String(nextCaseNum).padStart(3, '0');
    const newCaseId = `SC-${year}-${formattedNum}`;

    const newCase: SaruwaCase = {
      ...data,
      id: newCaseId,
      createdAt: new Date().toISOString(),
    };

    setCases((prev) => [newCase, ...prev]);

    // Automatically initialize Saruwa records for all active members
    const activeMembers = members.filter((m) => m.status === 'Active');
    const caseRecords: SaruwaRecord[] = activeMembers.map((m) => ({
      id: `REC-${newCaseId}-${m.id}`,
      caseId: newCaseId,
      memberId: m.id,
      memberName: m.fullName,
      mobileNumber: m.mobileNumber,
      saruwaAmount: newCase.defaultSaruwaAmount || settings.defaultSaruwaAmount || 530,
      status: 'Pending',
      paymentDate: null,
      paymentMode: null,
      receiptNumber: null,
      remarks: '',
      updatedAt: new Date().toISOString(),
    }));

    setRecords((prev) => [...prev, ...caseRecords]);
    setSelectedCaseId(newCaseId);

    return newCase;
  };

  const updateCase = (updated: SaruwaCase) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCase = (caseId: string) => {
    setCases((prev) => prev.filter((c) => c.id !== caseId));
    setRecords((prev) => prev.filter((r) => r.caseId !== caseId));
    if (selectedCaseId === caseId) {
      const remaining = cases.filter((c) => c.id !== caseId);
      if (remaining.length > 0) {
        setSelectedCaseId(remaining[0].id);
      }
    }
  };

  // Generate Receipt Number Helper
  const generateReceiptNumber = (): string => {
    const year = new Date().getFullYear();
    const existingReceiptNums = records
      .filter((r) => r.receiptNumber)
      .map((r) => {
        const match = r.receiptNumber?.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const nextNum = existingReceiptNums.length > 0 ? Math.max(...existingReceiptNums) + 1 : 1;
    const formatted = String(nextNum).padStart(3, '0');
    return `SR-${year}-${formatted}`;
  };

  // Record Saruwa Payment
  const recordSaruwaPayment = (
    recordId: string,
    details: {
      saruwaAmount: number;
      paymentMode: PaymentMode;
      paymentDate: string;
      remarks?: string;
      receiptNumber?: string;
    }
  ): SaruwaReceiptData => {
    const target = records.find((r) => r.id === recordId);
    const receiptNo = details.receiptNumber || target?.receiptNumber || generateReceiptNumber();

    let createdReceipt: SaruwaReceiptData | null = null;

    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const updated: SaruwaRecord = {
            ...r,
            saruwaAmount: details.saruwaAmount,
            status: 'Paid',
            paymentMode: details.paymentMode,
            paymentDate: details.paymentDate,
            receiptNumber: receiptNo,
            remarks: details.remarks || '',
            updatedAt: new Date().toISOString(),
          };

          const matchedCase = cases.find((c) => c.id === r.caseId);
          createdReceipt = {
            receiptNumber: receiptNo,
            saruwaContributorName: r.memberName,
            deceasedName: matchedCase ? matchedCase.deceasedName : 'Bereaved Family',
            saruwaCaseId: r.caseId,
            saruwaAmount: details.saruwaAmount,
            paymentMode: details.paymentMode,
            paymentDate: details.paymentDate,
            memberId: r.memberId,
            caseTitle: matchedCase ? `${matchedCase.deceasedName} (${matchedCase.familyMemberName})` : '',
          };

          return updated;
        }
        return r;
      })
    );

    if (createdReceipt) {
      setActiveReceipt(createdReceipt);
      return createdReceipt;
    }

    // Fallback if not found
    const fallbackCase = target ? cases.find((c) => c.id === target.caseId) : null;
    const fallbackReceipt: SaruwaReceiptData = {
      receiptNumber: receiptNo,
      saruwaContributorName: target?.memberName || 'Member',
      deceasedName: fallbackCase ? fallbackCase.deceasedName : 'Bereaved Family',
      saruwaCaseId: target?.caseId || '',
      saruwaAmount: details.saruwaAmount,
      paymentMode: details.paymentMode,
      paymentDate: details.paymentDate,
      memberId: target?.memberId || '',
    };
    setActiveReceipt(fallbackReceipt);
    return fallbackReceipt;
  };

  const revertSaruwaToPending = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'Pending',
              paymentMode: null,
              paymentDate: null,
              receiptNumber: null,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  // Get all issued receipts
  const getAllReceipts = (): SaruwaReceiptData[] => {
    return records
      .filter((r) => r.status === 'Paid' && r.receiptNumber && r.paymentMode && r.paymentDate)
      .map((r) => {
        const c = cases.find((item) => item.id === r.caseId);
        return {
          receiptNumber: r.receiptNumber!,
          saruwaContributorName: r.memberName,
          deceasedName: c ? c.deceasedName : 'Bereaved Family',
          saruwaCaseId: r.caseId,
          saruwaAmount: r.saruwaAmount,
          paymentMode: r.paymentMode!,
          paymentDate: r.paymentDate!,
          memberId: r.memberId,
          caseTitle: c ? `${c.deceasedName} (${c.familyMemberName})` : '',
        };
      })
      .sort((a, b) => b.receiptNumber.localeCompare(a.receiptNumber));
  };

  const getReceiptByNumber = (receiptNumber: string): SaruwaReceiptData | null => {
    const receipts = getAllReceipts();
    return receipts.find((r) => r.receiptNumber === receiptNumber) || null;
  };

  const openReceiptForRecord = (record: SaruwaRecord) => {
    if (record.status !== 'Paid' || !record.receiptNumber || !record.paymentMode || !record.paymentDate) {
      return;
    }
    const c = cases.find((item) => item.id === record.caseId);
    setActiveReceipt({
      receiptNumber: record.receiptNumber,
      saruwaContributorName: record.memberName,
      deceasedName: c ? c.deceasedName : 'Bereaved Family',
      saruwaCaseId: record.caseId,
      saruwaAmount: record.saruwaAmount,
      paymentMode: record.paymentMode,
      paymentDate: record.paymentDate,
      memberId: record.memberId,
      caseTitle: c ? `${c.deceasedName} (${c.familyMemberName})` : '',
    });
  };

  const updateSettings = (newSettings: TsokpaSettings) => {
    setSettings(newSettings);
  };

  const restoreData = (data: {
    members: Member[];
    cases: SaruwaCase[];
    records: SaruwaRecord[];
    settings?: TsokpaSettings;
  }): boolean => {
    if (!data.members || !Array.isArray(data.members)) return false;
    if (!data.cases || !Array.isArray(data.cases)) return false;
    if (!data.records || !Array.isArray(data.records)) return false;

    setMembers(data.members);
    setCases(data.cases);
    setRecords(data.records);
    if (data.settings) {
      setSettings(data.settings);
    }
    if (data.cases.length > 0) {
      setSelectedCaseId(data.cases[0].id);
    }
    return true;
  };

  const resetToDefaults = () => {
    setMembers(initialMembers);
    setCases(initialCases);
    setRecords(initialRecords);
    setSettings(initialSettings);
    setSelectedCaseId(initialCases[0]?.id || '');
  };

  return (
    <SaruwaContext.Provider
      value={{
        members,
        cases,
        records,
        settings,
        activeTab,
        setActiveTab,
        selectedCaseId,
        setSelectedCaseId,
        activeReceipt,
        setActiveReceipt,
        selectedMemberForNewCase,
        setSelectedMemberForNewCase,
        startNewCaseForMember,
        totalMembersCount,
        activeMembersCount,
        activeCasesCount,
        totalSaruwaCollected,
        totalPendingSaruwa,
        cashSaruwa,
        upiSaruwa,
        bankSaruwa,
        getCaseStats,
        getMemberHistory,
        addMember,
        updateMember,
        deleteMember,
        addCase,
        updateCase,
        deleteCase,
        recordSaruwaPayment,
        revertSaruwaToPending,
        getAllReceipts,
        getReceiptByNumber,
        openReceiptForRecord,
        updateSettings,
        restoreData,
        resetToDefaults,
      }}
    >
      {children}
    </SaruwaContext.Provider>
  );
};

export const useSaruwa = () => {
  const context = useContext(SaruwaContext);
  if (!context) {
    throw new Error('useSaruwa must be used within a SaruwaProvider');
  }
  return context;
};
