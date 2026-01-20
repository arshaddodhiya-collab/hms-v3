import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FrontDeskDashboardComponent } from './front-desk-dashboard.component';

@NgModule({
  declarations: [FrontDeskDashboardComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule.forChild([
      { path: '', component: FrontDeskDashboardComponent },
    ]),
  ],
})
export class FrontDeskModule {}
