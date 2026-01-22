import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRoutingModule } from './lab-routing.module';
import { CoreModule } from '../../core/core.module';

// Components
import { LabLayoutComponent } from './layout/lab-layout.component';
import { LabDashboardComponent } from './dashboard/lab-dashboard.component';
import { TestRequestsComponent } from './test-requests/test-requests.component';
import { ReportsComponent } from './reports/reports.component';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    LabLayoutComponent,
    LabDashboardComponent,
    TestRequestsComponent,
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    LabRoutingModule,
    CoreModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    InputTextModule,
  ],
})
export class LabModule {}
