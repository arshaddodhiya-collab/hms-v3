import { Component } from '@angular/core';

@Component({
  selector: 'app-billing-dashboard',
  template: `
    <div
      class="flex flex-column align-items-center justify-content-center h-screen surface-ground"
    >
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">
            Billing Dashboard
          </div>
          <span class="text-600 font-medium line-height-3"
            >Finance & Accounts</span
          >
        </div>
        <div>
          <p>Manage invoices and payments.</p>
          <button
            pButton
            pRipple
            label="Pending Invoices"
            class="w-full mb-3 p-button-warning"
          ></button>
          <button
            pButton
            pRipple
            label="Payment History"
            class="w-full p-button-secondary"
          ></button>
        </div>
      </div>
    </div>
  `,
})
export class BillingDashboardComponent {}
