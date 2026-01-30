import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { BillingSummaryComponent } from './components/billing-summary/billing-summary.component';
import { InvoiceGenerateComponent } from './components/invoice-generate/invoice-generate.component';
import { PaymentReceiptComponent } from './components/payment-receipt/payment-receipt.component';
import { BillingRoutingModule } from './billing-routing.module';

@NgModule({
  declarations: [
    BillingSummaryComponent,
    InvoiceGenerateComponent,
    PaymentReceiptComponent,
  ],
  imports: [CommonModule, BillingRoutingModule, SharedModule],
})
export class BillingModule {}
