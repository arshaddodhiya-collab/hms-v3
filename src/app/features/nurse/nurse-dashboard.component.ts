import { Component } from '@angular/core';

@Component({
  selector: 'app-nurse-dashboard',
  template: `
    <div
      class="flex flex-column align-items-center justify-content-center h-screen surface-ground"
    >
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Nurse Dashboard</div>
          <span class="text-600 font-medium line-height-3">Nursing Staff</span>
        </div>
        <div>
          <p>Patient care and vitals monitoring.</p>
          <button
            pButton
            pRipple
            label="Active Patients"
            class="w-full mb-3 p-button-info"
          ></button>
          <button
            pButton
            pRipple
            label="Vitals Log"
            class="w-full p-button-success"
          ></button>
        </div>
      </div>
    </div>
  `,
})
export class NurseDashboardComponent {}
