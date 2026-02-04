import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string | number;
  patientId: string | number;
  patientName: string;
  appointmentId?: string;
  date: Date;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Cancelled' | 'PENDING' | 'PAID' | 'CANCELLED';
  paymentDate?: Date;
  paymentMethod?: 'CASH' | 'CARD' | 'INSURANCE';
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private mockInvoices: Invoice[] = [
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

  private invoicesSubject = new BehaviorSubject<Invoice[]>(this.mockInvoices);
  public invoices$ = this.invoicesSubject.asObservable();

  constructor() {}

  getInvoices(): Observable<Invoice[]> {
    return this.invoices$.pipe(delay(500));
  }

  getInvoiceById(id: string | number): Invoice | undefined {
    // Loose check for id string/number
    return this.invoicesSubject.value.find((i) => i.id == id);
  }

  createInvoice(invoice: Invoice): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        invoice.id = 'INV-' + Math.floor(Math.random() * 10000);
        invoice.date = new Date();
        if (!invoice.status) invoice.status = 'PENDING';
        invoice.totalAmount = invoice.items.reduce(
          (sum, item) => sum + item.amount,
          0,
        );
        const current = this.invoicesSubject.value;
        this.invoicesSubject.next([invoice, ...current]);
      }),
    );
  }

  markAsPaid(
    id: string | number,
    method: 'CASH' | 'CARD' | 'INSURANCE',
  ): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        const current = this.invoicesSubject.value;
        const index = current.findIndex((i) => i.id == id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = {
            ...updated[index],
            status: 'PAID',
            paymentDate: new Date(),
            paymentMethod: method,
          };
          this.invoicesSubject.next(updated);
        }
      }),
    );
  }

  payInvoice(id: string | number): Observable<boolean> {
    return this.markAsPaid(id, 'CASH');
  }
}
