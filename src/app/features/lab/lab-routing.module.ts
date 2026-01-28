import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PERMISSIONS } from '../../core/constants/permissions.constants';
import { PermissionGuard } from '../../core/guards/guards';
import { LabRequestListComponent } from './components/lab-request-list/lab-request-list.component';
import { LabTestEntryComponent } from './components/lab-test-entry/lab-test-entry.component';
import { LabReportViewComponent } from './components/lab-report-view/lab-report-view.component';

const routes: Routes = [
  {
    path: '',
    component: LabRequestListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.MOD_LAB }, // Or just basic module access
    // Note: If MOD_LAB isn't defined yet, I might use a generic one or add it.
    // Based on plan: MOD_LAB, CMP_LAB_ENTRY, CMP_LAB_READ
  },
  {
    path: 'entry/:requestId',
    component: LabTestEntryComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.CMP_LAB_ENTRY },
  },
  {
    path: 'view/:requestId',
    component: LabReportViewComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.CMP_LAB_READ },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabRoutingModule {}
