import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BillingDashboardComponent } from './billing-dashboard.component';

@NgModule({
  declarations: [BillingDashboardComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule.forChild([{ path: '', component: BillingDashboardComponent }]),
  ],
})
export class BillingModule {}
