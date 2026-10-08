/**
 * WhatsApp message generator and link builder for Saruwa Management
 * Strictly adheres to community Saruwa terminology
 */

export interface ReceiptWhatsAppParams {
  contributorName: string;
  saruwaAmount: number;
  deceasedName: string;
  saruwaCaseId: string;
  receiptNumber: string;
  paymentDate: string;
  currencySymbol?: string;
}

export interface PendingReminderWhatsAppParams {
  memberName: string;
  deceasedName: string;
  saruwaAmount?: number;
  saruwaCaseId?: string;
  currencySymbol?: string;
}

export function formatReceiptWhatsAppMessage(params: ReceiptWhatsAppParams): string {
  const sym = params.currencySymbol || '₹';
  return `Thank you for your Saruwa contribution to Gorkha Buddhist Tsokpa.

Saruwa Contributor: ${params.contributorName}
Saruwa Amount: ${sym}${params.saruwaAmount.toLocaleString('en-IN')}
For: ${params.deceasedName}
Saruwa Case ID: ${params.saruwaCaseId}
Receipt No.: ${params.receiptNumber}
Date: ${params.paymentDate}

Thank you for your valuable support to the community.`;
}

export function formatPendingReminderWhatsAppMessage(params: PendingReminderWhatsAppParams): string {
  return `Dear ${params.memberName}, this is a gentle reminder regarding your Saruwa contribution for ${params.deceasedName}. Please make your Saruwa contribution at your convenience.

Thank you for your support.`;
}

export function sanitizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`; // Default to India (+91) if 10 digits
  }
  return digits;
}

export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = sanitizePhoneNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}
