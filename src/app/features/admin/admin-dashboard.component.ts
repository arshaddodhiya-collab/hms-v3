import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div
      class="flex flex-column align-items-center justify-content-center h-screen surface-ground"
    >
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Admin Dashboard</div>
          <span class="text-600 font-medium line-height-3"
            >Welcome, Administrator</span
          >
        </div>
        <div>
          <p>Manage users, settings, and system configurations here.</p>
          <button
            pButton
            pRipple
            label="System Health"
            class="w-full mb-3"
          ></button>
          <button
            pButton
            pRipple
            label="Manage Users"
            class="w-full p-button-secondary"
          ></button>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {}
