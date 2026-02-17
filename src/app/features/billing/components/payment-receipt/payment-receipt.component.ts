import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../services/billing.service';
import { Location } from '@angular/common';
import {
  PaymentRequest,
  InvoiceResponse,
  PaymentMethod,
  InvoiceStatus,
} from '../../models/billing.models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment-receipt',
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss'],
  providers: [MessageService],
})
export class PaymentReceiptComponent implements OnInit {
  id: string | null = null;
  invoice: InvoiceResponse | undefined;
  paymentAmount: number = 0;
  paymentMethod: PaymentMethod = PaymentMethod.CASH;
  paymentMethods = Object.values(PaymentMethod);
  InvoiceStatus = InvoiceStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService,
    private location: Location,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadInvoice(Number(this.id));
    }
  }

  loadInvoice(id: number): void {
    this.billingService.getInvoiceById(id).subscribe({
      next: (data) => {
        this.invoice = data;
        this.paymentAmount = data.dueAmount;
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/billing']);
      },
    });
  }

  makePayment(): void {
    if (!this.invoice) return;

    const request: PaymentRequest = {
      invoiceId: this.invoice.id,
      amount: this.paymentAmount,
      paymentMethod: this.paymentMethod,
      transactionReference: 'REF-' + Date.now(), // Mock ref for now
    };

    this.billingService.processPayment(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Payment Successful',
          detail: 'Payment recorded',
        });
        this.loadInvoice(this.invoice!.id);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Payment Failed',
          detail: 'Could not process payment',
        });
      },
    });
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    this.location.back();
  }
}
