import * as XLSX from 'xlsx';
import { Member, SaruwaCase, SaruwaRecord } from '../types';

/**
 * Exports data to an Excel (.xlsx) file
 */
export function exportToExcel(data: Record<string, any>[], fileName: string, sheetName = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Exports data to a CSV file
 */
export function exportToCSV(data: Record<string, any>[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Formats a Saruwa Case Report for Excel export
 */
export function exportCaseReportToExcel(
  saruwaCase: SaruwaCase,
  records: SaruwaRecord[],
  stats: {
    totalMembers: number;
    paidCount: number;
    pendingCount: number;
    totalCollected: number;
    totalPending: number;
    cashAmount: number;
    upiAmount: number;
    bankAmount: number;
  }
) {
  // Summary worksheet
  const summaryData = [
    { Parameter: 'Organization', Value: 'Gorkha Buddhist Tsokpa' },
    { Parameter: 'Report Type', Value: 'Saruwa Case Report' },
    { Parameter: 'Saruwa Case ID', Value: saruwaCase.id },
    { Parameter: 'Deceased Person Name', Value: saruwaCase.deceasedName },
    { Parameter: 'Family / Member Name', Value: saruwaCase.familyMemberName },
    { Parameter: 'Date of Death', Value: saruwaCase.deathDate },
    { Parameter: 'Collection Period', Value: `${saruwaCase.collectionStartDate} to ${saruwaCase.collectionEndDate}` },
    { Parameter: 'Total Members', Value: stats.totalMembers },
    { Parameter: 'Members Who Paid Saruwa', Value: stats.paidCount },
    { Parameter: 'Members With Pending Saruwa', Value: stats.pendingCount },
    { Parameter: 'Total Saruwa Collected (₹)', Value: stats.totalCollected },
    { Parameter: 'Total Pending Saruwa (₹)', Value: stats.totalPending },
    { Parameter: 'Cash Saruwa (₹)', Value: stats.cashAmount },
    { Parameter: 'UPI Saruwa (₹)', Value: stats.upiAmount },
    { Parameter: 'Bank Saruwa (₹)', Value: stats.bankAmount },
  ];

  // Detailed records worksheet
  const detailData = records.map((r, index) => ({
    'Sl. No.': index + 1,
    'Member ID': r.memberId,
    'Member Name': r.memberName,
    'Mobile Number': r.mobileNumber,
    'Saruwa Amount (₹)': r.saruwaAmount,
    'Payment Status': r.status,
    'Payment Date': r.paymentDate || 'N/A',
    'Payment Mode': r.paymentMode || 'N/A',
    'Receipt Number': r.receiptNumber || 'N/A',
    'Remarks': r.remarks || '',
  }));

  const workbook = XLSX.utils.book_new();
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  const detailSheet = XLSX.utils.json_to_sheet(detailData);

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Case Summary');
  XLSX.utils.book_append_sheet(workbook, detailSheet, 'Members Saruwa Collection');

  const cleanName = saruwaCase.deceasedName.replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(workbook, `Saruwa_Report_${saruwaCase.id}_${cleanName}.xlsx`);
}

/**
 * Exports complete Tsokpa backup as a structured JSON file
 */
export function exportBackupJSON(backupData: any, filename = 'Gorkha_Buddhist_Tsokpa_Saruwa_Backup') {
  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `${filename}_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
