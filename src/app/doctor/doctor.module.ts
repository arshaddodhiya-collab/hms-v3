import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DoctorDashboardComponent } from './doctor-dashboard.component';

@NgModule({
  declarations: [DoctorDashboardComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule.forChild([{ path: '', component: DoctorDashboardComponent }]),
  ],
})
export class DoctorModule {}
