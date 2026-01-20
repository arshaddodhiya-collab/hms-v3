import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LabDashboardComponent } from './lab-dashboard.component';

@NgModule({
  declarations: [LabDashboardComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule.forChild([{ path: '', component: LabDashboardComponent }]),
  ],
})
export class LabModule {}
