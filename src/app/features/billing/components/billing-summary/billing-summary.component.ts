import { Component, OnInit } from '@angular/core';
import { BillingService, Invoice } from '../../services/billing.service';
import { Router } from '@angular/router';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-billing-summary',
  templateUrl: './billing-summary.component.html',
  styleUrls: ['./billing-summary.component.scss'],
})
export class BillingSummaryComponent implements OnInit {
  invoices: Invoice[] = [];
  permissions = PERMISSIONS;

  constructor(
    private billingService: BillingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.billingService.getInvoices().subscribe((data) => {
      this.invoices = data;
    });
  }

  getSeverity(
    status: string,
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }

  createInvoice(): void {
    this.router.navigate(['/billing/invoice/new']);
  }

  viewReceipt(id: string): void {
    this.router.navigate(['/billing/receipt', id]);
  }
}
