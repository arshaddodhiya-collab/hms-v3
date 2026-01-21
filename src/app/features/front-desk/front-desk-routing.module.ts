import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontDeskLayoutComponent } from './layout/front-desk-layout.component';
import { FrontDeskDashboardComponent } from './front-desk-dashboard/front-desk-dashboard.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { AppointmentListComponent } from './appointments/appointment-list.component';
import { BillingComponent } from './billing/billing.component';

const routes: Routes = [
  {
    path: '',
    component: FrontDeskLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: FrontDeskDashboardComponent },
      { path: 'register', component: RegisterPatientComponent },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'billing', component: BillingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontDeskRoutingModule {}
