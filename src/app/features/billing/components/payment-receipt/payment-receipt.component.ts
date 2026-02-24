import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  PaymentRequest,
  InvoiceResponse,
  PaymentMethod,
  InvoiceStatus,
} from '../../models/billing.models';
import { MessageService } from 'primeng/api';
import { BillingFacade } from '../../facades/billing.facade';
import { BillingService } from '../../services/billing.service';

@Component({
  selector: 'app-payment-receipt',
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    public facade: BillingFacade,
    private billingService: BillingService,
    private location: Location,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
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
        this.cdr.markForCheck();
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
      transactionReference: 'REF-' + Date.now(),
    };

    this.facade.processPayment(request, () => {
      this.loadInvoice(this.invoice!.id);
    });
  }

  print(): void {
    window.print();
  }

  downloadPdf(): void {
    if (!this.invoice) return;
    this.billingService.downloadInvoicePdf(this.invoice.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${this.invoice!.invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to download PDF', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to download invoice PDF',
        });
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
