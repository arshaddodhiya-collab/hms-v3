import { Component } from '@angular/core';

@Component({
  selector: 'app-front-desk-dashboard',
  template: `
    <div
      class="flex flex-column align-items-center justify-content-center h-screen surface-ground"
    >
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">
            Front Desk Dashboard
          </div>
          <span class="text-600 font-medium line-height-3">Reception Area</span>
        </div>
        <div>
          <p>Manage patient appointments and registrations.</p>
          <button
            pButton
            pRipple
            label="New Patient"
            class="w-full mb-3 p-button-success"
          ></button>
          <button
            pButton
            pRipple
            label="Appointments"
            class="w-full p-button-info"
          ></button>
        </div>
      </div>
    </div>
  `,
})
export class FrontDeskDashboardComponent {}
