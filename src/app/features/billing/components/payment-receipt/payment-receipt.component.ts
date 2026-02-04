import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BillingService,
  Invoice,
} from '../../../../core/services/billing.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment-receipt',
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss'],
})
export class PaymentReceiptComponent implements OnInit {
  id: string | null = null;
  invoice: Invoice | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.invoice = this.billingService.getInvoiceById(this.id);
      if (!this.invoice) {
        this.router.navigate(['/billing']);
      }
    }
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    this.location.back();
  }
}
