import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AdminDashboardComponent } from './admin-dashboard.component';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule.forChild([{ path: '', component: AdminDashboardComponent }]),
  ],
})
export class AdminModule {}
