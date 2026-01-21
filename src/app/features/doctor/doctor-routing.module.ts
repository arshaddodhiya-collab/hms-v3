import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorLayoutComponent } from './layout/doctor-layout.component';
import { DoctorDashboardComponent } from './dashboard/doctor-dashboard.component';
import { DoctorScheduleComponent } from './schedule/doctor-schedule.component';
import { ConsultationComponent } from './consultation/consultation.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'schedule', component: DoctorScheduleComponent },
      { path: 'consultation/:id', component: ConsultationComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorRoutingModule {}
