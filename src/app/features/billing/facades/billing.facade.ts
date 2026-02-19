import { Injectable, signal, computed } from '@angular/core';
import { MessageService } from 'primeng/api';

import { BaseFacade } from '../../../core/facades/base-facade';
import { BillingService } from '../services/billing.service';
import { ChargeCatalogService } from '../services/charge-catalog.service';
import {
  InvoiceResponse,
  InvoiceRequest,
  PaymentRequest,
  PaymentResponse,
  BillingSummaryResponse,
} from '../models/billing.models';

/**
 * BillingFacade — Central state management for the Billing module.
 */
@Injectable({
  providedIn: 'root',
})
export class BillingFacade extends BaseFacade<InvoiceResponse> {
  // --- Signals ---
  readonly invoices = signal<InvoiceResponse[]>([]);
  readonly selectedInvoice = signal<InvoiceResponse | null>(null);
  readonly billingSummary = signal<BillingSummaryResponse | null>(null);
  readonly saving = signal(false);

  // --- Computed ---
  readonly totalRevenue = computed(() =>
    this.invoices().reduce((sum, inv) => sum + inv.paidAmount, 0),
  );
  readonly outstandingAmount = computed(() =>
    this.invoices().reduce((sum, inv) => sum + inv.dueAmount, 0),
  );

  constructor(
    private billingService: BillingService,
    private messageService: MessageService,
  ) {
    super();
  }

  // ==============================
  //  ACTIONS
  // ==============================

  override load(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading.set(true);
    this.billingService.getAllInvoices().subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load invoices',
        });
      },
    });
  }

  loadInvoiceById(id: number): void {
    this.loading.set(true);
    this.billingService.getInvoiceById(id).subscribe({
      next: (data) => {
        this.selectedInvoice.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load invoice details',
        });
      },
    });
  }

  loadSummary(patientId: number): void {
    this.billingService.getBillingSummary(patientId).subscribe({
      next: (data) => this.billingSummary.set(data),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load billing summary',
        });
      },
    });
  }

  createInvoice(
    request: InvoiceRequest,
    onSuccess: (invoice: InvoiceResponse) => void,
  ): void {
    this.saving.set(true);
    this.billingService.createInvoice(request).subscribe({
      next: (invoice) => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Invoice created successfully.',
        });
        onSuccess(invoice);
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create invoice',
        });
      },
    });
  }

  processPayment(
    request: PaymentRequest,
    onSuccess: (payment: PaymentResponse) => void,
  ): void {
    this.saving.set(true);
    this.billingService.processPayment(request).subscribe({
      next: (payment) => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Payment Processed',
          detail: 'Payment recorded successfully.',
        });
        onSuccess(payment);
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to process payment',
        });
      },
    });
  }
}
