import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  InvoiceRequest,
  InvoiceResponse,
  PaymentRequest,
  PaymentResponse,
  BillingSummaryResponse,
} from '../models/billing.models';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private apiUrl = `${environment.apiUrl}/billing`;

  constructor(private http: HttpClient) {}

  createInvoice(request: InvoiceRequest): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(`${this.apiUrl}/invoices`, request);
  }

  processPayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/payments`, request);
  }

  getBillingSummary(patientId: number): Observable<BillingSummaryResponse> {
    return this.http.get<BillingSummaryResponse>(
      `${this.apiUrl}/summary/${patientId}`,
    );
  }

  getOutstandingInvoices(patientId: number): Observable<InvoiceResponse[]> {
    const params = new HttpParams().set('patientId', patientId.toString());
    return this.http.get<InvoiceResponse[]>(`${this.apiUrl}/outstanding`, {
      params,
    });
  }

  getAllInvoices(): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(`${this.apiUrl}/invoices`);
  }

  getInvoiceById(id: number): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.apiUrl}/invoices/${id}`);
  }
}
