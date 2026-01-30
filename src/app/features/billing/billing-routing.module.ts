import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/constants/permissions.constants';
import { PermissionGuard } from '../../core/guards/guards';
import { BillingSummaryComponent } from './components/billing-summary/billing-summary.component';
import { InvoiceGenerateComponent } from './components/invoice-generate/invoice-generate.component';
import { PaymentReceiptComponent } from './components/payment-receipt/payment-receipt.component';

const routes: Routes = [
  {
    path: '',
    component: BillingSummaryComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.MOD_BILLING },
  },
  {
    path: 'invoice/new',
    component: InvoiceGenerateComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.CMP_INVOICE_GENERATE },
  },
  {
    path: 'receipt/:id',
    component: PaymentReceiptComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.CMP_PAYMENT_RECEIPT },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
