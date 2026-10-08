export type PaymentMode = 'Cash' | 'UPI' | 'Bank';
export type PaymentStatus = 'Paid' | 'Pending';
export type MemberStatus = 'Active' | 'Inactive';
export type CaseStatus = 'Active' | 'Completed';

export interface Member {
  id: string; // e.g. "GBT-101"
  fullName: string;
  fatherHusbandName: string;
  mobileNumber: string;
  address: string;
  joiningDate: string; // YYYY-MM-DD
  status: MemberStatus;
  createdAt: string;
}

export interface SaruwaCase {
  id: string; // e.g. "SC-2026-001"
  deceasedName: string;
  familyMemberName: string;
  associatedMemberId?: string;
  deathDate: string; // YYYY-MM-DD
  address: string;
  contactPerson: string;
  contactNumber: string;
  collectionStartDate: string; // YYYY-MM-DD
  collectionEndDate: string; // YYYY-MM-DD
  notes: string;
  status: CaseStatus;
  defaultSaruwaAmount: number;
  createdAt: string;
}

export interface SaruwaRecord {
  id: string; // unique ID
  caseId: string;
  memberId: string;
  memberName: string;
  mobileNumber: string;
  saruwaAmount: number;
  status: PaymentStatus;
  paymentDate: string | null; // YYYY-MM-DD
  paymentMode: PaymentMode | null;
  receiptNumber: string | null; // e.g. "SR-2026-001"
  remarks: string;
  updatedAt: string;
}

export interface SaruwaReceiptData {
  receiptNumber: string;
  saruwaContributorName: string;
  deceasedName: string;
  saruwaCaseId: string;
  saruwaAmount: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  memberId: string;
  caseTitle?: string;
}

export interface TsokpaSettings {
  orgName: string;
  orgSubtitle: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  presidentName: string;
  secretaryName: string;
  treasurerName: string;
  defaultSaruwaAmount: number;
  currencySymbol: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'members'
  | 'new-saruwa'
  | 'saruwa-cases'
  | 'saruwa-collection'
  | 'pending-saruwa'
  | 'saruwa-receipts'
  | 'saruwa-history'
  | 'reports'
  | 'backup-restore'
  | 'settings';
