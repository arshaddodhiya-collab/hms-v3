import { Component } from '@angular/core';

@Component({
  selector: 'app-lab-dashboard',
  template: `
    <div
      class="flex flex-column align-items-center justify-content-center h-screen surface-ground"
    >
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Lab Dashboard</div>
          <span class="text-600 font-medium line-height-3"
            >Laboratory Services</span
          >
        </div>
        <div>
          <p>Manage tests and results.</p>
          <button
            pButton
            pRipple
            label="Pending Tests"
            class="w-full mb-3 p-button-danger"
          ></button>
          <button
            pButton
            pRipple
            label="Results Archive"
            class="w-full p-button-help"
          ></button>
        </div>
      </div>
    </div>
  `,
})
export class LabDashboardComponent {}
