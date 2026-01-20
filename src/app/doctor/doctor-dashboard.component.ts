import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-dashboard',
  template: `
    <div
      class="flex flex-column align-items-center justify-content-center h-screen surface-ground"
    >
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Doctor Dashboard</div>
          <span class="text-600 font-medium line-height-3">Medical Staff</span>
        </div>
        <div>
          <p>View patient records and manage treatments.</p>
          <button
            pButton
            pRipple
            label="My Patients"
            class="w-full mb-3 p-button-help"
          ></button>
          <button
            pButton
            pRipple
            label="Schedule"
            class="w-full p-button-warning"
          ></button>
        </div>
      </div>
    </div>
  `,
})
export class DoctorDashboardComponent {}
