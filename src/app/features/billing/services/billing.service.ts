import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  date: Date;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentDate?: Date;
  paymentMethod?: 'CASH' | 'CARD' | 'INSURANCE';
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-1001',
    patientId: 'P-101',
    patientName: 'John Doe',
    appointmentId: 'APT-101',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    items: [
      { description: 'Consultation Fee', amount: 50 },
      { description: 'Blood Test', amount: 30 },
    ],
    totalAmount: 80,
    status: 'PAID',
    paymentDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    paymentMethod: 'CASH',
  },
  {
    id: 'INV-1002',
    patientId: 'P-102',
    patientName: 'Jane Smith',
    appointmentId: 'APT-102',
    date: new Date(),
    items: [{ description: 'Consultation Fee', amount: 50 }],
    totalAmount: 50,
    status: 'PENDING',
  },
];

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private invoices$ = new BehaviorSubject<Invoice[]>(MOCK_INVOICES);

  constructor() {}

  getInvoices(): Observable<Invoice[]> {
    return this.invoices$.asObservable();
  }

  getInvoiceById(id: string): Invoice | undefined {
    return this.invoices$.getValue().find((i) => i.id === id);
  }

  createInvoice(invoice: Invoice): void {
    const current = this.invoices$.getValue();
    this.invoices$.next([invoice, ...current]);
  }

  markAsPaid(id: string, method: 'CASH' | 'CARD' | 'INSURANCE'): void {
    const current = this.invoices$.getValue();
    const index = current.findIndex((i) => i.id === id);
    if (index !== -1) {
      current[index].status = 'PAID';
      current[index].paymentDate = new Date();
      current[index].paymentMethod = method;
      this.invoices$.next([...current]);
    }
  }
}
