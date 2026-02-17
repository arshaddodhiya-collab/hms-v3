export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  INSURANCE = 'INSURANCE',
}

export interface InvoiceItemResponse {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  chargeId?: number;
}

export interface PaymentResponse {
  id: number;
  invoiceId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  status: string;
  paymentDate: string; // ISO Date
  receivedBy: number; // User ID
  notes?: string;
}

export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  patientId: number;
  patientName: string;
  admissionId?: number;
  encounterId?: number; // OPD reference
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string;
  generatedBy: number;
  items: InvoiceItemResponse[];
  payments: PaymentResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface BillingSummaryResponse {
  patientId: number;
  totalBilledAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  outstandingInvoiceCount: number;
  recentInvoices: InvoiceResponse[];
}

export interface PaymentRequest {
  invoiceId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  notes?: string;
}

export interface InvoiceItemRequest {
  description: string;
  unitPrice: number;
  quantity: number;
}

export interface InvoiceRequest {
  patientId: number;
  admissionId?: number; // Optional, for IPD
  encounterId?: number; // Optional, for OPD
  status?: string; // DRAFT, GENERATED
  discountAmount?: number;
  taxAmount?: number;
  items?: InvoiceItemRequest[];
  chargeIds?: number[];
}
