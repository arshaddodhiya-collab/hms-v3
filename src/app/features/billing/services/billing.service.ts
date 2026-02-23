import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
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
  private path = 'billing';

  constructor(private apiService: ApiService) {}

  createInvoice(request: InvoiceRequest): Observable<InvoiceResponse> {
    return this.apiService.post<InvoiceResponse>(
      `${this.path}/invoices`,
      request,
    );
  }

  processPayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.apiService.post<PaymentResponse>(
      `${this.path}/payments`,
      request,
    );
  }

  getBillingSummary(patientId: number): Observable<BillingSummaryResponse> {
    return this.apiService.get<BillingSummaryResponse>(
      `${this.path}/summary/${patientId}`,
    );
  }

  getOutstandingInvoices(patientId: number): Observable<InvoiceResponse[]> {
    const params = new HttpParams().set('patientId', patientId.toString());
    return this.apiService.get<InvoiceResponse[]>(
      `${this.path}/outstanding`,
      params,
    );
  }

  getAllInvoices(): Observable<InvoiceResponse[]> {
    return this.apiService.get<InvoiceResponse[]>(`${this.path}/invoices`);
  }

  getInvoiceById(id: number): Observable<InvoiceResponse> {
    return this.apiService.get<InvoiceResponse>(`${this.path}/invoices/${id}`);
  }
}
