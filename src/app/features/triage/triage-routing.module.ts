import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../core/guards/guards';
import { VitalsEntryComponent } from './components/vitals-entry/vitals-entry.component';
import { VitalsViewComponent } from './components/vitals-view/vitals-view.component';
import { TriageListComponent } from './components/triage-list/triage-list.component';

import { TriageQueueComponent } from './components/triage-queue/triage-queue.component';

const routes: Routes = [
  {
    path: 'vitals/:encounterId', // For recording vitals
    component: VitalsEntryComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_VITALS_WRITE' },
  },
  {
    path: 'view/:appointmentId',
    component: VitalsViewComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_VITALS_READ' },
  },
  {
    path: '',
    component: TriageQueueComponent, // Default is queue
    canActivate: [PermissionGuard],
    data: { permission: 'MOD_TRIAGE' },
  },
  {
    path: 'list',
    component: TriageListComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'MOD_TRIAGE' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriageRoutingModule {}
