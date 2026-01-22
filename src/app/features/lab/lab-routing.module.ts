import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabLayoutComponent } from './layout/lab-layout.component';
import { LabDashboardComponent } from './dashboard/lab-dashboard.component';
import { TestRequestsComponent } from './test-requests/test-requests.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: LabLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: LabDashboardComponent },
      { path: 'requests', component: TestRequestsComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabRoutingModule {}
